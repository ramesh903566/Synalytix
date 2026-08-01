import { Router, Request, Response } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth";
import { supabase, decrypt } from "../lib/supabase";
import { streamChat, type ChatMessage } from "../lib/ai/chat-adapter";
import type { AIProviderConfig } from "../lib/ai/provider";

const router = Router();

const NewConversationSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  model_provider: z.string().min(1).max(50).optional(),
  model_name: z.string().min(1).max(100).optional(),
});

const UpdateConversationSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  pinned: z.boolean().optional(),
  archived: z.boolean().optional(),
  model_provider: z.string().min(1).max(50).optional(),
  model_name: z.string().min(1).max(100).optional(),
});

const SendMessageSchema = z.object({
  content: z.string().min(1).max(50000),
  context: z.record(z.unknown()).optional(),
});

// ─── GET /api/chat/history ──────────────────────────────────────────────────
router.get("/history", authenticate, async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const offset = (page - 1) * limit;
  const search = (req.query.search as string) || "";
  const filter = (req.query.filter as string) || "all"; // all | pinned | archived

  try {
    let query = supabase
      .from("conversations")
      .select("*", { count: "exact" })
      .eq("user_id", req.userId!)
      .order("updated_at", { ascending: false });

    if (search) {
      const safeSearch = search.replace(/[%_]/g, '\\$&');
      query = query.ilike("title", `%${safeSearch}%`);
    }
    if (filter === "pinned") {
      query = query.eq("pinned", true);
    } else if (filter === "archived") {
      query = query.eq("archived", true);
    } else {
      query = query.eq("archived", false);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);
    if (error) throw error;

    res.json({
      success: true,
      data: {
        conversations: data,
        total: count || 0,
        page,
        limit,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/chat/new ─────────────────────────────────────────────────────
router.post("/new", authenticate, async (req: Request, res: Response) => {
  const parsed = NewConversationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.issues[0].message });
    return;
  }

  const { title, model_provider, model_name } = parsed.data;

  try {
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: req.userId!,
        title: title || "New Chat",
        model_provider: model_provider || "openai",
        model_name: model_name || "gpt-4o",
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/chat/:id ──────────────────────────────────────────────────────
router.get("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { data: conversation, error: convErr } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", req.params.id)
      .eq("user_id", req.userId!)
      .single();

    if (convErr || !conversation) {
      res.status(404).json({ success: false, error: "Conversation not found" });
      return;
    }

    const { data: messages, error: msgErr } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", req.params.id)
      .order("created_at", { ascending: true });

    if (msgErr) throw msgErr;

    res.json({
      success: true,
      data: { ...conversation, messages: messages || [] },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── PATCH /api/chat/:id ────────────────────────────────────────────────────
router.patch("/:id", authenticate, async (req: Request, res: Response) => {
  const parsed = UpdateConversationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.issues[0].message });
    return;
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const data = parsed.data;

  if (data.title !== undefined) updates.title = data.title;
  if (data.pinned !== undefined) updates.pinned = data.pinned;
  if (data.archived !== undefined) updates.archived = data.archived;
  if (data.model_provider !== undefined) updates.model_provider = data.model_provider;
  if (data.model_name !== undefined) updates.model_name = data.model_name;

  try {
    const { data, error } = await supabase
      .from("conversations")
      .update(updates)
      .eq("id", req.params.id)
      .eq("user_id", req.userId!)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── DELETE /api/chat/:id ───────────────────────────────────────────────────
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.userId!);

    if (error) throw error;

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/chat/:id/messages (SSE streaming) ────────────────────────────
router.post("/:id/messages", authenticate, async (req: Request, res: Response) => {
  const parsed = SendMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.issues[0].message });
    return;
  }

  const { content, context } = parsed.data;

  try {
    // 1. Verify conversation belongs to user
    const { data: conversation, error: convErr } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", req.params.id)
      .eq("user_id", req.userId!)
      .single();

    if (convErr || !conversation) {
      res.status(404).json({ success: false, error: "Conversation not found" });
      return;
    }

    // 2. Persist user message
    const { error: userMsgErr } = await supabase.from("messages").insert({
      conversation_id: req.params.id,
      role: "user",
      content,
    });
    if (userMsgErr) throw userMsgErr;

    // 3. Fetch conversation history for context
    const { data: history } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", req.params.id)
      .order("created_at", { ascending: true })
      .limit(50);

    // 4. Fetch user's provider config
    const { data: providerConfig } = await supabase
      .from("user_providers")
      .select("api_key, model, base_url, provider")
      .eq("user_id", req.userId!)
      .eq("provider", conversation.model_provider)
      .eq("model", conversation.model_name)
      .eq("is_active", true)
      .single();

    // 5. Build messages array with optional context
    const systemMessage = buildSystemMessage(context);
    const messages: ChatMessage[] = [
      ...(systemMessage ? [{ role: "system" as const, content: systemMessage }] : []),
      ...(history || []).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ];

    // 6. Set up SSE response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    // 7. Stream response
    const config: AIProviderConfig = providerConfig
      ? {
          apiKey: decrypt(providerConfig.api_key),
          model: providerConfig.model,
          baseUrl: providerConfig.base_url || undefined,
        }
      : {};

    let fullResponse = "";

    await streamChat(conversation.model_provider, messages, config, {
      onToken: (token) => {
        res.write(`data: ${JSON.stringify({ type: "token", content: token })}\n\n`);
      },
      onComplete: async (fullText) => {
        fullResponse = fullText;

        // Persist assistant message
        await supabase.from("messages").insert({
          conversation_id: req.params.id,
          role: "assistant",
          content: fullText,
        });

        // Update conversation timestamp
        await supabase
          .from("conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", req.params.id);

        res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
        res.end();
      },
      onError: async (err) => {
        res.write(`data: ${JSON.stringify({ type: "error", error: err.message })}\n\n`);
        res.end();
      },
    });
  } catch (err: any) {
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.write(`data: ${JSON.stringify({ type: "error", error: err.message })}\n\n`);
      res.end();
    }
  }
});

// ─── Helper: build system message with page context ─────────────────────────

function buildSystemMessage(context?: Record<string, unknown>): string {
  const parts = [
    "You are Synalytix AI, a helpful assistant for developers and content creators.",
    "You help analyze social media metrics, GitHub activity, career progress, and content strategy.",
    "Be concise, actionable, and data-driven in your responses.",
  ];

  if (context && Object.keys(context).length > 0) {
    parts.push("");
    parts.push("Current page context:");
    if (context.page) parts.push(`- Page: ${context.page}`);
    if (context.platform) parts.push(`- Platform: ${context.platform}`);
    if (context.selectedAccount) parts.push(`- Selected account: ${context.selectedAccount}`);
    if (context.selectedRepo) parts.push(`- Selected repo: ${context.selectedRepo}`);
    if (context.dateRange) {
      const dr = context.dateRange as { start: string; end: string };
      parts.push(`- Date range: ${dr.start} to ${dr.end}`);
    }
    if (context.activeMetrics) {
      parts.push(`- Visible metrics: ${(context.activeMetrics as string[]).join(", ")}`);
    }
  }

  return parts.join("\n");
}

export default router;
