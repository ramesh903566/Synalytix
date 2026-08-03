-- ============================================================================
-- Synalytix Database Schema
-- Generated from remote database state
-- ============================================================================

-- Enums
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');
CREATE TYPE "Priority" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');
CREATE TYPE "RecommendationCategory" AS ENUM (
  'CAREER_GROWTH', 'PERSONAL_BRANDING', 'TECHNICAL_SKILLS',
  'NETWORKING', 'OPEN_SOURCE', 'ENTREPRENEURSHIP'
);

-- ============================================================================
-- Core Tables
-- ============================================================================

-- Platform connections (OAuth)
CREATE TABLE platform_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('github', 'instagram', 'x', 'linkedin', 'leetcode', 'google-calendar')),
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  platform_user_id TEXT NOT NULL,
  platform_username TEXT NOT NULL,
  scope TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_synced TIMESTAMPTZ,
  x_capabilities JSONB DEFAULT '[]'::jsonb,
  UNIQUE(user_id, platform)
);

CREATE INDEX idx_platform_connections_user_id ON platform_connections(user_id);
CREATE INDEX idx_platform_connections_expires_at ON platform_connections(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_platform_connections_last_synced ON platform_connections(last_synced) WHERE last_synced IS NOT NULL;

ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own connections" ON platform_connections
  FOR SELECT USING (( SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own connections" ON platform_connections
  FOR INSERT WITH CHECK (( SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own connections" ON platform_connections
  FOR UPDATE USING (( SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own connections" ON platform_connections
  FOR DELETE USING (( SELECT auth.uid()) = user_id);

-- OAuth states
CREATE TABLE oauth_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  state_token TEXT NOT NULL UNIQUE,
  code_verifier TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_oauth_states_token ON oauth_states(state_token);
CREATE INDEX idx_oauth_states_created_at ON oauth_states(created_at);
CREATE INDEX idx_oauth_states_user_id ON oauth_states(user_id);

ALTER TABLE oauth_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own oauth states" ON oauth_states
  FOR ALL USING (( SELECT auth.uid()) = user_id);

-- API cache
CREATE TABLE api_cache (
  cache_key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  cached_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_api_cache_cached_at ON api_cache(cached_at);

ALTER TABLE api_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for cache" ON api_cache
  FOR ALL USING (false);

-- User profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  handle TEXT UNIQUE,
  plan_tier TEXT NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'pro', 'business', 'enterprise')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (( SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (( SELECT auth.uid()) = id);

CREATE POLICY "Service role can insert profiles" ON user_profiles
  FOR INSERT TO service_role WITH CHECK (true);

-- ============================================================================
-- Recommendation System
-- ============================================================================

CREATE TABLE "RecommendationRun" (
  id TEXT PRIMARY KEY DEFAULT (gen_random_uuid())::text,
  "userId" TEXT NOT NULL,
  "orgId" TEXT NOT NULL,
  "profileSnapshot" JSONB NOT NULL,
  "generatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "modelUsed" TEXT NOT NULL,
  "tokenCount" INTEGER
);

CREATE INDEX idx_rec_run_user_time ON "RecommendationRun"("userId", "generatedAt" DESC);
CREATE INDEX idx_rec_run_org ON "RecommendationRun"("orgId");

ALTER TABLE "RecommendationRun" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_owns_run" ON "RecommendationRun"
  FOR ALL USING ((( SELECT auth.uid())::text = "userId"));

CREATE TABLE "Recommendation" (
  id TEXT PRIMARY KEY DEFAULT (gen_random_uuid())::text,
  "runId" TEXT NOT NULL REFERENCES "RecommendationRun"(id),
  "userId" TEXT NOT NULL,
  "orgId" TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  category "RecommendationCategory" NOT NULL,
  priority "Priority" NOT NULL,
  "impactScore" INTEGER NOT NULL CHECK ("impactScore" >= 0 AND "impactScore" <= 100),
  difficulty "Difficulty" NOT NULL,
  "expectedOutcome" TEXT NOT NULL,
  "actionSteps" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "dataSources" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "completedAt" TIMESTAMPTZ,
  "dismissedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  provider_used VARCHAR NOT NULL DEFAULT 'anthropic',
  estimated_time_value INTEGER NOT NULL,
  estimated_time_unit VARCHAR NOT NULL CHECK (estimated_time_unit::text = ANY (ARRAY['days', 'weeks', 'months']::text[])),
  confidence_level VARCHAR NOT NULL CHECK (confidence_level::text = ANY (ARRAY['low', 'medium', 'high']::text[]))
);

CREATE INDEX idx_rec_action_steps ON "Recommendation" USING gin ("actionSteps" jsonb_path_ops);
CREATE INDEX idx_rec_user_category ON "Recommendation"("userId", category);
CREATE INDEX idx_rec_org_priority ON "Recommendation"("orgId", priority);
CREATE INDEX idx_rec_active ON "Recommendation"("userId", priority) WHERE "dismissedAt" IS NULL AND "completedAt" IS NULL;
CREATE INDEX idx_rec_data_sources ON "Recommendation" USING gin ("dataSources" jsonb_path_ops);
CREATE INDEX idx_rec_run_id ON "Recommendation"("runId");

ALTER TABLE "Recommendation" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_owns_rec" ON "Recommendation"
  FOR ALL USING ((( SELECT auth.uid())::text = "userId"));

CREATE TABLE "CareerScore" (
  id TEXT PRIMARY KEY DEFAULT (gen_random_uuid())::text,
  "userId" TEXT NOT NULL,
  "orgId" TEXT NOT NULL,
  career INTEGER NOT NULL CHECK (career >= 0 AND career <= 100),
  employability INTEGER NOT NULL CHECK (employability >= 0 AND employability <= 100),
  branding INTEGER NOT NULL CHECK (branding >= 0 AND branding <= 100),
  technical INTEGER NOT NULL CHECK (technical >= 0 AND technical <= 100),
  "computedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_career_score_user_time ON "CareerScore"("userId", "computedAt" DESC);

ALTER TABLE "CareerScore" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_owns_score" ON "CareerScore"
  FOR ALL USING ((( SELECT auth.uid())::text = "userId"));

CREATE TABLE "OpportunityAlert" (
  id TEXT PRIMARY KEY DEFAULT (gen_random_uuid())::text,
  "userId" TEXT NOT NULL,
  "orgId" TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  trigger TEXT NOT NULL,
  "detectedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "dismissedAt" TIMESTAMPTZ
);

CREATE INDEX idx_opp_alert_user ON "OpportunityAlert"("userId", "detectedAt" DESC);

ALTER TABLE "OpportunityAlert" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_owns_alert" ON "OpportunityAlert"
  FOR ALL USING ((( SELECT auth.uid())::text = "userId"));

-- ============================================================================
-- AI / Chat System
-- ============================================================================

CREATE TABLE ai_custom_instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  provider VARCHAR NOT NULL,
  instructions TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX ai_custom_instructions_user_id_provider_key ON ai_custom_instructions(user_id, provider);

ALTER TABLE ai_custom_instructions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_owns_instructions" ON ai_custom_instructions
  FOR ALL USING ((( SELECT auth.uid())::text = user_id));

-- ============================================================================
-- LeetCode
-- ============================================================================

CREATE TABLE leetcode_profile_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "timestamp" TIMESTAMPTZ NOT NULL DEFAULT now(),
  ranking INTEGER,
  contest_rating DOUBLE PRECISION,
  global_ranking INTEGER,
  easy_solved INTEGER,
  medium_solved INTEGER,
  hard_solved INTEGER,
  acceptance_rate DOUBLE PRECISION,
  reputation INTEGER,
  streak INTEGER,
  activity_summary JSONB
);

CREATE INDEX idx_leetcode_profile_snapshots_user_id_timestamp ON leetcode_profile_snapshots(user_id, "timestamp" DESC);

ALTER TABLE leetcode_profile_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own leetcode snapshots" ON leetcode_profile_snapshots
  FOR SELECT USING (( SELECT auth.uid()) = user_id);

-- ============================================================================
-- User Providers (API Keys)
-- ============================================================================

CREATE TABLE user_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('anthropic', 'openai', 'gemini', 'deepseek', 'grok')),
  api_key TEXT NOT NULL,
  model TEXT NOT NULL,
  base_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider, model)
);

CREATE INDEX idx_user_providers_user_id ON user_providers(user_id);

ALTER TABLE user_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_owns_providers" ON user_providers
  FOR ALL USING (( SELECT auth.uid()) = user_id);

-- ============================================================================
-- Conversations / Chat
-- ============================================================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Chat',
  model_provider TEXT NOT NULL DEFAULT 'openai',
  model_name TEXT NOT NULL DEFAULT 'gpt-4o',
  pinned BOOLEAN NOT NULL DEFAULT false,
  archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_user_updated ON conversations(user_id, updated_at DESC);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_owns_conversations" ON conversations
  FOR ALL USING (( SELECT auth.uid()) = user_id);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_owns_messages" ON messages
  FOR ALL USING (conversation_id IN (
    SELECT id FROM conversations WHERE user_id = ( SELECT auth.uid())
  ));

-- ============================================================================
-- Functions & Triggers
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.cleanup_stale_data()
RETURNS void AS $$
BEGIN
  DELETE FROM oauth_states WHERE created_at < NOW() - INTERVAL '15 minutes';
  DELETE FROM api_cache WHERE cached_at < NOW() - INTERVAL '3 hours';
END;
$$ LANGUAGE plpgsql;
