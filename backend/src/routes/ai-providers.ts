import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import { supabase, encrypt } from "../lib/supabase";
import { testProviderConnection } from "../lib/ai/chat-adapter";

const router = Router();

// ─── GET /api/ai/models ─────────────────────────────────────────────────────
// Returns the user's configured providers/models with connection status.
router.get("/models", authenticate, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("user_providers")
      .select("id, provider, model, base_url, is_active, created_at")
      .eq("user_id", req.userId!)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Group by provider for the frontend model selector
    const models = (data || []).map((row) => ({
      id: row.id,
      provider: row.provider,
      model: row.model,
      displayName: formatModelName(row.provider, row.model),
      isActive: row.is_active,
      hasCustomBase: !!row.base_url,
      createdAt: row.created_at,
    }));

    res.json({ success: true, data: models });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/ai/providers ─────────────────────────────────────────────────
// Save or update a provider configuration.
router.post("/providers", authenticate, async (req: Request, res: Response) => {
  const { provider, api_key, model, base_url } = req.body;

  if (!provider || !api_key || !model) {
    res.status(400).json({
      success: false,
      error: "provider, api_key, and model are required",
    });
    return;
  }

  const validProviders = ["anthropic", "openai", "gemini", "deepseek", "grok"];
  if (!validProviders.includes(provider)) {
    res.status(400).json({
      success: false,
      error: `Invalid provider. Must be one of: ${validProviders.join(", ")}`,
    });
    return;
  }

  try {
    // Encrypt API key before storing
    const encryptedKey = encrypt(api_key);

    // Upsert: one config per user+provider+model
    const { data, error } = await supabase
      .from("user_providers")
      .upsert(
        {
          user_id: req.userId!,
          provider,
          api_key: encryptedKey,
          model,
          base_url: base_url || null,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,provider,model" }
      )
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: {
        id: data.id,
        provider: data.provider,
        model: data.model,
        displayName: formatModelName(data.provider, data.model),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── DELETE /api/ai/providers/:id ───────────────────────────────────────────
router.delete("/providers/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from("user_providers")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.userId!);

    if (error) throw error;

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/ai/providers/test ────────────────────────────────────────────
// Test connection to a provider with given credentials.
router.post("/providers/test", authenticate, async (req: Request, res: Response) => {
  const { provider, api_key, model, base_url } = req.body;

  if (!provider || !api_key || !model) {
    res.status(400).json({
      success: false,
      error: "provider, api_key, and model are required",
    });
    return;
  }

  const result = await testProviderConnection(provider, {
    apiKey: api_key,
    model,
    baseUrl: base_url || undefined,
  });

  res.json({ success: true, data: result });
});

// ─── Helper ─────────────────────────────────────────────────────────────────

function formatModelName(provider: string, model: string): string {
  const labels: Record<string, string> = {
    anthropic: "Claude",
    openai: "GPT",
    gemini: "Gemini",
    deepseek: "DeepSeek",
    grok: "Grok",
  };
  return `${labels[provider] || provider} ${model}`;
}

export default router;
