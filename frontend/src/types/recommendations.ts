import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const PrioritySchema = z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]);
export const DifficultySchema = z.enum(["EASY", "MEDIUM", "HARD"]);
export const CategorySchema = z.enum([
  "CAREER_GROWTH",
  "PERSONAL_BRANDING",
  "TECHNICAL_SKILLS",
  "NETWORKING",
  "OPEN_SOURCE",
  "ENTREPRENEURSHIP",
]);

export type Priority = z.infer<typeof PrioritySchema>;
export type Difficulty = z.infer<typeof DifficultySchema>;
export type RecommendationCategory = z.infer<typeof CategorySchema>;

// ─── Core entities ────────────────────────────────────────────────────────────

export const OpportunityAlertSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  trigger: z.string(),
  detectedAt: z.string(),
  dismissedAt: z.string().nullable().optional(),
});

export const RecommendationSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(600),
  reasoning: z.string().min(20).max(400),
  category: CategorySchema,
  priority: PrioritySchema,
  impactScore: z.number().int().min(0).max(100),
  difficulty: DifficultySchema,
  estimatedTime: z.object({
    value: z.number(),
    unit: z.enum(['days', 'weeks', 'months'])
  }),
  expectedOutcome: z.string(),
  actionSteps: z.array(z.string()).min(1).max(7),
  dataSources: z.array(z.string()),
  confidenceLevel: z.enum(['low', 'medium', 'high']),
  completedAt: z.string().nullable(),
  dismissedAt: z.string().nullable(),
  createdAt: z.string(),
  providerUsed: z.string().default('anthropic'),
});

export const CareerScoreSchema = z.object({
  career: z.number().int().min(0).max(100),
  employability: z.number().int().min(0).max(100),
  branding: z.number().int().min(0).max(100),
  technical: z.number().int().min(0).max(100),
  computedAt: z.string(),
});

export const MonthlyWeekSchema = z.object({
  week: z.number().int().min(1).max(4),
  goal: z.string(),
  milestones: z.array(z.string()).min(2).max(4),
});

export const GapAnalysisSchema = z.object({
  skills: z.array(z.string()),
  assets: z.array(z.string()),
  activities: z.array(z.string()),
});

// ─── AI raw output (what the LLM returns) ─────────────────────────────────────

export const AIRecommendationRawSchema = z.object({
  title: z.string(),
  description: z.string(),
  reasoning: z.string().min(20),
  category: CategorySchema,
  priority: PrioritySchema,
  impact_score: z.number().int().min(0).max(100),
  difficulty: DifficultySchema,
  estimated_time: z.object({
    value: z.number(),
    unit: z.enum(['days', 'weeks', 'months'])
  }),
  expected_outcome: z.string(),
  action_steps: z.array(z.string()),
  confidence_level: z.enum(['low', 'medium', 'high']),
});

export const AIOutputSchema = z.object({
  recommendations: z.array(AIRecommendationRawSchema),
  weekly_plan: z.array(z.string()),
  monthly_roadmap: z.array(MonthlyWeekSchema),
  gaps: GapAnalysisSchema,
  opportunity_alerts: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      trigger: z.string(),
    })
  ),
});

// ─── Profile ──────────────────────────────────────────────────────────────────

export const UnifiedUserProfileSchema = z.object({
  userId: z.string(),
  careerGoal: z.string(),
  experienceLevel: z.enum(["student", "junior", "mid", "senior", "lead"]),
  primaryStack: z.array(z.string()),
  connectedPlatforms: z.array(z.string()),
  scores: z.object({
    github: z.number().nullable(),
    linkedin: z.number().nullable(),
    leetcode: z.number().nullable(),
    x: z.number().nullable(),
  }),
  rawMetrics: z.record(z.string(), z.unknown()),
});

// ─── API contracts ────────────────────────────────────────────────────────────

export const GenerateInputSchema = z.object({
  forceRefresh: z.boolean().default(false),
  focusCategory: CategorySchema.optional(),
});

export const GenerateOutputSchema = z.object({
  success: z.literal(true),
  data: z.object({
    runId: z.string(),
    recommendations: z.array(RecommendationSchema),
    scores: CareerScoreSchema,
    scoreDelta: z.object({
      career: z.number(),
      employability: z.number(),
      branding: z.number(),
      technical: z.number(),
    }).nullable(),
    weeklyPlan: z.array(z.string()).length(5),
    monthlyRoadmap: z.array(MonthlyWeekSchema).length(4),
    gaps: GapAnalysisSchema,
    opportunityAlerts: z.array(OpportunityAlertSchema),
  }),
});

export const ErrorOutputSchema = z.object({
  success: z.literal(false),
  error: z.object({ code: z.string(), message: z.string() }),
});

// ─── TypeScript types (inferred) ──────────────────────────────────────────────

export type Recommendation = z.infer<typeof RecommendationSchema>;
export type CareerScore = z.infer<typeof CareerScoreSchema>;
export type MonthlyWeek = z.infer<typeof MonthlyWeekSchema>;
export type GapAnalysis = z.infer<typeof GapAnalysisSchema>;
export type OpportunityAlert = z.infer<typeof OpportunityAlertSchema>;
export type UnifiedUserProfile = z.infer<typeof UnifiedUserProfileSchema>;
export type GenerateInput = z.infer<typeof GenerateInputSchema>;
export type GenerateOutput = z.infer<typeof GenerateOutputSchema>;
export type AIOutput = z.infer<typeof AIOutputSchema>;
