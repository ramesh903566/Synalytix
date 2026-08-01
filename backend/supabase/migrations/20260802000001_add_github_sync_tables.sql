-- Migration to add GitHub specific tracking tables for synchronization.

CREATE TABLE IF NOT EXISTS github_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  followers INT DEFAULT 0,
  following INT DEFAULT 0,
  public_repos INT DEFAULT 0,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS github_repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  repo_id TEXT NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT,
  html_url TEXT,
  language TEXT,
  stargazers_count INT DEFAULT 0,
  forks_count INT DEFAULT 0,
  is_private BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, repo_id)
);

CREATE TABLE IF NOT EXISTS github_activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  repo TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- We don't have event IDs from the simplified events API response in the current githubService,
  -- so we can use a composite unique constraint to prevent duplicates if needed, 
  -- but since we drop/re-insert or append, we'll likely just clear and re-insert recent events.
  UNIQUE(user_id, type, repo, created_at)
);

CREATE TABLE IF NOT EXISTS github_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  bytes INT NOT NULL DEFAULT 0,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, language)
);

CREATE TABLE IF NOT EXISTS github_insights (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_score INT DEFAULT 0,
  insights_json JSONB DEFAULT '[]'::jsonb,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE github_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own github profiles" ON github_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own github repos" ON github_repositories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own github activity" ON github_activity_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own github languages" ON github_languages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own github insights" ON github_insights FOR SELECT USING (auth.uid() = user_id);

-- Backend service role needs full access for sync operations, which is granted by default when using service key,
-- but for clarity we can ensure no inserts/updates from clients.
CREATE POLICY "Service role only for insert/update profiles" ON github_profiles FOR ALL USING (false);
CREATE POLICY "Service role only for insert/update repos" ON github_repositories FOR ALL USING (false);
CREATE POLICY "Service role only for insert/update activity" ON github_activity_events FOR ALL USING (false);
CREATE POLICY "Service role only for insert/update languages" ON github_languages FOR ALL USING (false);
CREATE POLICY "Service role only for insert/update insights" ON github_insights FOR ALL USING (false);
