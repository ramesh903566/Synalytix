-- Synalytix Chat Tables Migration
-- Creates conversations, messages, and user_providers tables for the AI Chat Assistant panel.

-- ─── TABLE: user_providers ────────────────────────────────────────────────────
-- Stores per-user BYOK provider configurations (API keys, models).
-- Keys are AES-256-GCM encrypted at the application layer before storage.

CREATE TABLE user_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('anthropic', 'openai', 'gemini', 'deepseek', 'grok')),
  api_key TEXT NOT NULL,
  model TEXT NOT NULL,
  base_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, provider, model)
);

CREATE INDEX idx_user_providers_user_id ON user_providers(user_id);

-- ─── TABLE: conversations ─────────────────────────────────────────────────────

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Chat',
  model_provider TEXT NOT NULL DEFAULT 'openai',
  model_name TEXT NOT NULL DEFAULT 'gpt-4o',
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_user_updated ON conversations(user_id, updated_at DESC);

-- ─── TABLE: messages ──────────────────────────────────────────────────────────

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at ASC);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

ALTER TABLE user_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- user_providers: users can only manage their own provider configs
CREATE POLICY "user_owns_providers" ON user_providers FOR ALL USING (auth.uid() = user_id);

-- conversations: users can only see/modify their own conversations
CREATE POLICY "user_owns_conversations" ON conversations FOR ALL USING (auth.uid() = user_id);

-- messages: users can only access messages in their own conversations
CREATE POLICY "user_owns_messages" ON messages FOR ALL
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );
