-- Settings Expansion Migration
-- Adds last_synced tracking, fixes platform CHECK constraint for leetcode/google-calendar,
-- and adds x_capabilities column for capability-aware detection.

-- 1. Add last_synced column to platform_connections
ALTER TABLE platform_connections
  ADD COLUMN IF NOT EXISTS last_synced TIMESTAMPTZ;

-- Backfill from updated_at for existing rows
UPDATE platform_connections SET last_synced = updated_at WHERE last_synced IS NULL;

-- 2. Fix platform CHECK constraint — add leetcode and google-calendar
-- Drop the old constraint and create a new one that includes all platforms
ALTER TABLE platform_connections DROP CONSTRAINT IF EXISTS platform_connections_platform_check;
ALTER TABLE platform_connections
  ADD CONSTRAINT platform_connections_platform_check
  CHECK (platform IN ('github', 'instagram', 'x', 'linkedin', 'leetcode', 'google-calendar'));

-- 3. Add x_capabilities column for capability-aware detection
ALTER TABLE platform_connections
  ADD COLUMN IF NOT EXISTS x_capabilities JSONB DEFAULT '[]'::jsonb;

-- 4. Create index for faster platform lookups with last_synced
CREATE INDEX IF NOT EXISTS idx_platform_connections_last_synced
  ON platform_connections (last_synced)
  WHERE last_synced IS NOT NULL;
