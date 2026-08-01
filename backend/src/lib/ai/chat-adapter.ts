import Anthropic from "@anthropic-ai/sdk";
import { providerRegistry, type AIProviderConfig } from "./provider";

// ─── Streaming Chat Adapter ─────────────────────────────────────────────────
// Extends the existing provider registry with streaming support for chat.
// Frontend never branches on provider name — all differences handled here.

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}

// ─── Anthropic Streaming ────────────────────────────────────────────────────

async function streamAnthropic(
  messages: ChatMessage[],
  config: AIProviderConfig,
  callbacks: StreamCallbacks
): Promise<void> {
  const client = new Anthropic({ apiKey: config.apiKey || process.env.ANTHROPIC_API_KEY! });
  const systemMsg = messages.find((m) => m.role === "system")?.content || "";
  const chatMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  const stream = client.messages.stream({
    model: config.model || "claude-3-opus-20240229",
    max_tokens: Number(process.env.AI_MAX_TOKENS ?? 4000),
    temperature: Number(process.env.AI_TEMPERATURE ?? 0.4),
    system: systemMsg,
    messages: chatMessages,
  });

  let fullText = "";
  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      fullText += event.delta.text;
      callbacks.onToken(event.delta.text);
    }
  }
  callbacks.onComplete(fullText);
}

// ─── OpenAI-Compatible Streaming ────────────────────────────────────────────

async function streamOpenAICompatible(
  messages: ChatMessage[],
  config: AIProviderConfig,
  callbacks: StreamCallbacks
): Promise<void> {
  const apiKey = config.apiKey || process.env.OPENAI_API_KEY!;
  const baseUrl = config.baseUrl || "https://api.openai.com/v1";

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || "gpt-4o",
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: Number(process.env.AI_TEMPERATURE ?? 0.4),
      stream: true,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI API error: ${res.statusText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let fullText = "";
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
      const data = trimmed.slice(6);
      if (data === "[DONE]") continue;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          fullText += content;
          callbacks.onToken(content);
        }
      } catch {
        // skip malformed chunks
      }
    }
  }

  callbacks.onComplete(fullText);
}

// ─── Gemini Streaming ───────────────────────────────────────────────────────

async function streamGemini(
  messages: ChatMessage[],
  config: AIProviderConfig,
  callbacks: StreamCallbacks
): Promise<void> {
  const apiKey = config.apiKey || process.env.GEMINI_API_KEY!;
  const model = config.model || "gemini-1.5-pro";
  const systemMsg = messages.find((m) => m.role === "system")?.content || "";
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents,
        systemInstruction: systemMsg ? { parts: [{ text: systemMsg }] } : undefined,
        generationConfig: {
          temperature: Number(process.env.AI_TEMPERATURE ?? 0.4),
        },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.statusText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let fullText = "";
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
        const parsed = JSON.parse(trimmed.slice(6));
        const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) {
          fullText += content;
          callbacks.onToken(content);
        }
      } catch {
        // skip malformed chunks
      }
    }
  }

  callbacks.onComplete(fullText);
}

// ─── Router: picks the right stream function by provider name ───────────────

export async function streamChat(
  providerName: string,
  messages: ChatMessage[],
  config: AIProviderConfig,
  callbacks: StreamCallbacks
): Promise<void> {
  try {
    switch (providerName) {
      case "anthropic":
        await streamAnthropic(messages, config, callbacks);
        break;
      case "openai":
      case "deepseek":
      case "grok":
        await streamOpenAICompatible(messages, config, callbacks);
        break;
      case "gemini":
        await streamGemini(messages, config, callbacks);
        break;
      default:
        throw new Error(`Unsupported provider: ${providerName}`);
    }
  } catch (err) {
    callbacks.onError(err instanceof Error ? err : new Error(String(err)));
  }
}

// ─── Non-streaming chat (for simple completions) ────────────────────────────

export async function chatCompletion(
  providerName: string,
  messages: ChatMessage[],
  config: AIProviderConfig
): Promise<string> {
  return new Promise((resolve, reject) => {
    let fullText = "";
    streamChat(providerName, messages, config, {
      onToken: (token) => { fullText += token; },
      onComplete: () => resolve(fullText),
      onError: (err) => reject(err),
    });
  });
}

// ─── Provider health check ──────────────────────────────────────────────────

export async function testProviderConnection(
  providerName: string,
  config: AIProviderConfig
): Promise<{ success: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    await chatCompletion(
      providerName,
      [{ role: "user", content: "Reply with only: OK" }],
      config
    );
    return { success: true, latencyMs: Date.now() - start };
  } catch (err) {
    return {
      success: false,
      latencyMs: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
