-- ═══════════════════════════════════════════════════════════════════════════
-- Synalytix — LeetCode Integration Migration
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Make access_token nullable since LeetCode doesn't use OAuth tokens
ALTER TABLE platform_connections ALTER COLUMN access_token DROP NOT NULL;

-- 2. Create the leetcode_profile_snapshots table (append-only)
CREATE TABLE IF NOT EXISTS leetcode_profile_snapshots (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ranking           INT,
  contest_rating    FLOAT,
  global_ranking    INT,
  easy_solved       INT,
  medium_solved     INT,
  hard_solved       INT,
  acceptance_rate   FLOAT,
  reputation        INT,
  streak            INT,
  activity_summary  JSONB
);

-- 3. Indexes for fast retrieval of latest snapshots
CREATE INDEX IF NOT EXISTS idx_leetcode_profile_snapshots_user_id_timestamp
  ON leetcode_profile_snapshots (user_id, timestamp DESC);

-- 4. Enable RLS
ALTER TABLE leetcode_profile_snapshots ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
CREATE POLICY "Users can view own leetcode snapshots"
  ON leetcode_profile_snapshots FOR SELECT
  USING (auth.uid() = user_id);

-- Backend service role handles inserts/updates, bypassing RLS automatically.
