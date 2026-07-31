import { providerRegistry } from "../ai/provider";
import { ALL_CONNECTORS } from "./connectors";
import { buildUnifiedProfile, computeCareerScores } from "./profile-builder";
import { buildSystemPrompt, buildUserPrompt } from "./prompt-builder";
import { CACHE_TTL_SECONDS, CONFIDENCE_THRESHOLD, RATE_LIMIT_PER_HOUR } from "./constants";
import { supabase as db } from "../supabase";
import { redis } from "../redis";
import { logger } from "../logger";
import type { GenerateOutput } from "../../types/recommendations";

export class RecommendationEngine {

  async generateForUser(userId: string, orgId: string, forceRefresh = false): Promise<GenerateOutput["data"]> {
    const rateKey = `rate:recs:${userId}`;
    const cacheKey = `cache:recs:${userId}`;

    // 1. Rate limiting
    const requests = await redis.incr(rateKey);
    if (requests === 1) {
      await redis.expire(rateKey, 3600);
    }
    if (requests > RATE_LIMIT_PER_HOUR) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    // 2. Cache check
    if (!forceRefresh) {
      const cachedStr = await redis.get(cacheKey);
      if (cachedStr) {
        logger.info("Returning cached recommendations", { userId });
        return JSON.parse(cachedStr);
      }
    }

    // 3. Build unified profile
    const profile = await buildUnifiedProfile(userId, ALL_CONNECTORS);
    const scores = computeCareerScores(profile.scores);

    // 4. Fetch Custom Instructions
    const { data: customInst } = await db
      .from("ai_custom_instructions")
      .select("instructions")
      .eq("user_id", userId)
      .eq("provider", "global")
      .single();
    
    const instructions = customInst?.instructions || "";

    // 5. Generate prompts
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(profile);

    // 6. Define fallback chain (Gemini 3.1 Pro first)
    const providers = [
      { name: "gemini", config: { model: "gemini-3.1-pro" } },
      { name: "anthropic", config: { model: "claude-3-opus-20240229" } },
      { name: "openai", config: { model: "gpt-4o" } }
    ];

    // 7. Call AI with fallback and validation built-in
    let aiOutput;
    let providerUsed = "gemini";
    try {
      const result = await providerRegistry.executeWithFallback(
        userId,
        providers,
        instructions,
        systemPrompt,
        userPrompt
      );
      aiOutput = result.output;
      providerUsed = result.providerUsed;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error("AI generation failed", { userId, error: errMsg });
      throw new Error(`AI generation failed: ${errMsg}`);
    }

    // 8. Filter low confidence (assuming 'high' and 'medium' are valid, dropping 'low')
    const filteredRecs = aiOutput.recommendations.filter(
      (r) => r.confidence_level === 'high' || r.confidence_level === 'medium'
    );

    // 8. DB Transaction: save the run, recs, score, and alerts
    const { data: run, error: runErr } = await db
      .from("RecommendationRun")
      .insert({
        userId,
        orgId,
        profileSnapshot: profile,
        modelUsed: providerUsed,
      })
      .select("id")
      .single();

    if (runErr || !run) throw new Error("Failed to create recommendation run");

    // Insert CareerScore
    await db.from("CareerScore").insert({
      userId,
      orgId,
      career: scores.career,
      employability: scores.employability,
      branding: scores.branding,
      technical: scores.technical,
    });

    // Insert Recommendations
    const recsToInsert = filteredRecs.map((r) => ({
      runId: run.id,
      userId,
      orgId,
      title: r.title,
      description: r.description,
      reasoning: r.reasoning,
      category: r.category,
      priority: r.priority,
      impactScore: r.impact_score,
      difficulty: r.difficulty,
      estimated_time_value: r.estimated_time.value,
      estimated_time_unit: r.estimated_time.unit,
      expectedOutcome: r.expected_outcome,
      actionSteps: r.action_steps,
      confidence_level: r.confidence_level,
      provider_used: providerUsed,
    }));

    if (recsToInsert.length > 0) {
      const { data: savedRecs, error: recsErr } = await db
        .from("Recommendation")
        .insert(recsToInsert)
        .select();
      if (recsErr) throw new Error("Failed to save recommendations");

      // Insert Alerts
      if (aiOutput.opportunity_alerts.length > 0) {
        await db.from("OpportunityAlert").insert(
          aiOutput.opportunity_alerts.map((a) => ({
            userId,
            orgId,
            title: a.title,
            description: a.description,
            trigger: a.trigger,
          }))
        );
      }

      // Compute Delta (mock implementation, you'd fetch previous score)
      const scoreDelta = { career: 0, employability: 0, branding: 0, technical: 0 };

      // Get saved alerts
      const { data: savedAlerts } = await db
        .from("OpportunityAlert")
        .select()
        .eq("userId", userId)
        .order("detectedAt", { ascending: false });

      const finalOutput: GenerateOutput["data"] = {
        runId: run.id,
        recommendations: savedRecs as any, // casting due to camelCase/snake_case mapping,
        scores,
        scoreDelta,
        weeklyPlan: aiOutput.weekly_plan,
        monthlyRoadmap: aiOutput.monthly_roadmap,
        gaps: aiOutput.gaps,
        opportunityAlerts: (savedAlerts || []) as any,
      };

      // 9. Cache output
      await redis.set(cacheKey, JSON.stringify(finalOutput), "EX", CACHE_TTL_SECONDS);

      return finalOutput;
    }

    throw new Error("No valid recommendations generated");
  }
}

export const engine = new RecommendationEngine();
