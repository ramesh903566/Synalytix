-- Synalytix AI Expansion Migration
-- Applied to support multi-model recommendations, time estimates, confidence levels, and custom settings.

-- 1. Modify Recommendation table
ALTER TABLE "Recommendation"
  RENAME COLUMN "reason" TO "reasoning";

ALTER TABLE "Recommendation"
  ADD COLUMN "provider_used" VARCHAR(50) NOT NULL DEFAULT 'anthropic',
  DROP COLUMN "estimatedTime",
  ADD COLUMN "estimated_time_value" INTEGER,
  ADD COLUMN "estimated_time_unit" VARCHAR(10) CHECK (estimated_time_unit IN ('days', 'weeks', 'months')),
  DROP COLUMN "confidenceScore",
  ADD COLUMN "confidence_level" VARCHAR(10) CHECK (confidence_level IN ('low', 'medium', 'high'));

-- Set default values for existing rows (if any)
UPDATE "Recommendation"
SET 
  "estimated_time_value" = 2,
  "estimated_time_unit" = 'weeks',
  "confidence_level" = 'medium'
WHERE "estimated_time_value" IS NULL;

-- Make them NOT NULL
ALTER TABLE "Recommendation"
  ALTER COLUMN "estimated_time_value" SET NOT NULL,
  ALTER COLUMN "estimated_time_unit" SET NOT NULL,
  ALTER COLUMN "confidence_level" SET NOT NULL;

-- 2. Create ai_custom_instructions table
CREATE TABLE "ai_custom_instructions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" TEXT NOT NULL,
  "provider" VARCHAR(50) NOT NULL,
  "instructions" TEXT NOT NULL,
  "updated_at" TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("user_id", "provider")
);

-- RLS for custom instructions
ALTER TABLE "ai_custom_instructions" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_owns_instructions" ON "ai_custom_instructions" FOR ALL USING (auth.uid()::TEXT = "user_id");
