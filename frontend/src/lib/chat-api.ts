import { getAuthToken } from "../lib/auth-token";

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...headers,
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
  const data = await request<{ success: boolean; data: ProviderModel[] }>(
    "/ai/models"
  );
  return data.data;
}

export async function saveProvider(payload: {
  provider: string;
  api_key: string;
  model: string;
  base_url?: string;
}): Promise<void> {
  await request("/ai/providers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteProvider(id: string): Promise<void> {
  await request(`/ai/providers/${id}`, { method: "DELETE" });
}

export async function testProvider(payload: {
  provider: string;
  api_key: string;
  model: string;
  base_url?: string;
}): Promise<{ success: boolean; latencyMs?: number; error?: string }> {
  const data = await request<{
    success: boolean;
    data: { success: boolean; latencyMs?: number; error?: string };
  }>("/ai/providers/test", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.data;
}

// ─── Chat ───────────────────────────────────────────────────────────────────

export interface ChatConversation {
  id: string;
  title: string;
  model_provider: string;
  model_name: string;
  pinned: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface ChatHistoryResponse {
  conversations: ChatConversation[];
  total: number;
  page: number;
  limit: number;
}

export async function fetchChatHistory(
  page = 1,
  limit = 20,
  search = "",
  filter = "all"
): Promise<ChatHistoryResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) params.set("search", search);
  if (filter !== "all") params.set("filter", filter);

  const data = await request<{ success: boolean; data: ChatHistoryResponse }>(
    `/chat/history?${params}`
  );
  return data.data;
}

export async function createConversation(
  title?: string,
  model_provider?: string,
  model_name?: string
): Promise<ChatConversation> {
  const data = await request<{ success: boolean; data: ChatConversation }>(
    "/chat/new",
    {
      method: "POST",
      body: JSON.stringify({ title, model_provider, model_name }),
    }
  );
  return data.data;
}

export async function getConversation(
  id: string
): Promise<ChatConversation & { messages: ChatMessage[] }> {
  const data = await request<{
    success: boolean;
    data: ChatConversation & { messages: ChatMessage[] };
  }>(`/chat/${id}`);
  return data.data;
}

export async function updateConversation(
  id: string,
  updates: Partial<Pick<ChatConversation, "title" | "pinned" | "archived" | "model_provider" | "model_name">>
): Promise<ChatConversation> {
  const data = await request<{ success: boolean; data: ChatConversation }>(
    `/chat/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    }
  );
  return data.data;
}

export async function deleteConversation(id: string): Promise<void> {
  await request(`/chat/${id}`, { method: "DELETE" });
}

// ─── SSE Streaming ──────────────────────────────────────────────────────────

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}

export async function sendMessageStream(
  conversationId: string,
  content: string,
  context?: Record<string, unknown>,
  callbacks?: StreamCallbacks
): Promise<void> {
  const token = await getAuthToken();
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
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (!jsonStr) continue;

        try {
          const event = JSON.parse(jsonStr);
          if (event.type === "token") {
            fullText += event.content;
            callbacks?.onToken(event.content);
          } else if (event.type === "done") {
            callbacks?.onComplete(fullText);
          } else if (event.type === "error") {
            callbacks?.onError(new Error(event.error));
          }
        } catch {
          // skip malformed events
        }
      }
    }
  } catch (err) {
    callbacks?.onError(err instanceof Error ? err : new Error("Stream read failed"));
  }
}
