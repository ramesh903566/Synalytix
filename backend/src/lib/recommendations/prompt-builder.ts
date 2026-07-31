import type { UnifiedUserProfile } from "../../types/recommendations";

// Strip any content that could inject into the AI system prompt
function sanitiseForPrompt(value: string): string {
  return value
    .replace(/[{}]/g, "")
    .replace(/system:|assistant:|user:/gi, "")
    .trim()
    .slice(0, 200);
}

export function buildSystemPrompt(): string {
  return `You are a senior career intelligence AI embedded in Synalytix, a professional growth platform.

Your task: analyse the developer's unified career profile and return structured, actionable career recommendations.

STRICT RULES — violating any rule means the response will be rejected:
1. Respond ONLY with a single valid JSON object. No preamble, no markdown code fences, no trailing text.
2. Every recommendation must include a "confidence_level" of "low", "medium", or "high". Omit recommendations below "medium" if possible.
3. Prioritise by real-world career ROI. Be specific: reference actual numbers from the profile in "reasoning".
4. "action_steps" must be concrete, imperative, time-bound tasks (e.g. "Publish a blog post on dev.to about X by Friday" not "Write more content").
5. "weekly_plan" must contain exactly 5 strings derived from CRITICAL or HIGH priority recommendations.
6. "monthly_roadmap" must have exactly 4 objects with week numbers 1–4, each with a "goal" string and 2–4 "milestones".
7. "opportunity_alerts" should highlight signals from the data (e.g. "GitHub activity up 40% — good time to seek visibility").
8. Keep all text professional, encouraging, and specific to the data provided.`;
}

export function buildUserPrompt(profile: UnifiedUserProfile): string {
  const sanitised = {
    ...profile,
    careerGoal: sanitiseForPrompt(profile.careerGoal),
    primaryStack: profile.primaryStack.map((s) => sanitiseForPrompt(s)),
  };

  return `Analyse this career profile and return the full recommendation payload.

PROFILE:
${JSON.stringify(sanitised, null, 2)}

Return a JSON object with this exact structure (no deviations):
{
  "recommendations": [
    {
      "title": "string (max 120 chars)",
      "description": "string (max 600 chars)",
      "reasoning": "string referencing specific data points",
      "category": "CAREER_GROWTH | PERSONAL_BRANDING | TECHNICAL_SKILLS | NETWORKING | OPEN_SOURCE | ENTREPRENEURSHIP",
      "priority": "CRITICAL | HIGH | MEDIUM | LOW",
      "impact_score": 0-100,
      "difficulty": "EASY | MEDIUM | HARD",
      "estimated_time": {
        "value": 3,
        "unit": "weeks"
      },
      "expected_outcome": "string",
      "action_steps": ["step 1", "step 2", "step 3"],
      "confidence_level": "low | medium | high"
    }
  ],
  "weekly_plan": ["action 1", "action 2", "action 3", "action 4", "action 5"],
  "monthly_roadmap": [
    { "week": 1, "goal": "string", "milestones": ["milestone 1", "milestone 2"] },
    { "week": 2, "goal": "string", "milestones": ["milestone 1", "milestone 2"] },
    { "week": 3, "goal": "string", "milestones": ["milestone 1", "milestone 2"] },
    { "week": 4, "goal": "string", "milestones": ["milestone 1", "milestone 2"] }
  ],
  "gaps": {
    "skills": ["skill1", "skill2"],
    "assets": ["asset1"],
    "activities": ["activity1"]
  },
  "opportunity_alerts": [
    { "title": "string", "description": "string", "trigger": "signal_identifier" }
  ]
}`;
}
