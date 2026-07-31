const API_BASE = "/api";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ─── Models ─────────────────────────────────────────────────────────────────

export interface ProviderModel {
  id: string;
  provider: string;
  model: string;
  displayName: string;
  isActive: boolean;
  hasCustomBase: boolean;
  createdAt: string;
}

export async function fetchModels(): Promise<ProviderModel[]> {
  const res = await request<{ success: boolean; data: ProviderModel[] }>(
    "/ai/models"
  );
  return res.data;
}

export async function saveProvider(config: {
  provider: string;
  api_key: string;
  model: string;
  base_url?: string;
}): Promise<{ id: string; provider: string; model: string; displayName: string }> {
  const res = await request<{
    success: boolean;
    data: { id: string; provider: string; model: string; displayName: string };
  }>("/ai/providers", {
    method: "POST",
    body: JSON.stringify(config),
  });
  return res.data;
}

export async function deleteProvider(id: string): Promise<void> {
  await request(`/ai/providers/${id}`, { method: "DELETE" });
}

export async function testProvider(config: {
  provider: string;
  api_key: string;
  model: string;
  base_url?: string;
}): Promise<{ success: boolean; latencyMs: number; error?: string }> {
  const res = await request<{
    success: boolean;
    data: { success: boolean; latencyMs: number; error?: string };
  }>("/ai/providers/test", {
    method: "POST",
    body: JSON.stringify(config),
  });
  return res.data;
}

// ─── Conversations ──────────────────────────────────────────────────────────

export interface ConversationSummary {
  id: string;
  title: string;
  model_provider: string;
  model_name: string;
  pinned: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation extends ConversationSummary {
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  attachments: unknown[];
  pinned: boolean;
  created_at: string;
}

export interface HistoryResponse {
  conversations: ConversationSummary[];
  total: number;
  page: number;
  limit: number;
}

export async function fetchHistory(
  page = 1,
  limit = 20,
  search = "",
  filter = "all"
): Promise<HistoryResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search && { search }),
    ...(filter !== "all" && { filter }),
  });
  const res = await request<{ success: boolean; data: HistoryResponse }>(
    `/chat/history?${params}`
  );
  return res.data;
}

export async function fetchConversation(id: string): Promise<Conversation> {
  const res = await request<{ success: boolean; data: Conversation }>(
    `/chat/${id}`
  );
  return res.data;
}

export async function createConversation(data?: {
  title?: string;
  model_provider?: string;
  model_name?: string;
}): Promise<ConversationSummary> {
  const res = await request<{ success: boolean; data: ConversationSummary }>(
    "/chat/new",
    {
      method: "POST",
      body: JSON.stringify(data || {}),
    }
  );
  return res.data;
}

export async function updateConversation(
  id: string,
  updates: {
    title?: string;
    pinned?: boolean;
    archived?: boolean;
    model_provider?: string;
    model_name?: string;
  }
): Promise<ConversationSummary> {
  const res = await request<{ success: boolean; data: ConversationSummary }>(
    `/chat/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    }
  );
  return res.data;
}

export async function deleteConversation(id: string): Promise<void> {
  await request(`/chat/${id}`, { method: "DELETE" });
}

// ─── Streaming Chat ─────────────────────────────────────────────────────────

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

export async function sendMessageStream(
  conversationId: string,
  content: string,
  context?: Record<string, unknown>,
  callbacks?: StreamCallbacks
): Promise<void> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/chat/${conversationId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ content, context }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    callbacks?.onError(body.error || `Stream failed: ${res.status}`);
    return;
  }

  const reader = res.body?.getReader();
  if (!reader) {
    callbacks?.onError("No response body");
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;

      try {
        const event = JSON.parse(trimmed.slice(6));
        if (event.type === "token") {
          callbacks?.onToken(event.content);
        } else if (event.type === "done") {
          callbacks?.onDone();
        } else if (event.type === "error") {
          callbacks?.onError(event.error);
        }
      } catch {
        // skip malformed
      }
    }
  }
}
