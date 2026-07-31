import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { supabase } from '../lib/supabase';

const router = Router();

const InstructionsSchema = z.object({
  provider: z.string().default('global'),
  instructions: z.string().min(1).max(10000),
});

// GET /api/settings/ai-instructions
router.get('/ai-instructions', authenticate, async (req: Request, res: Response) => {
  const provider = (req.query.provider as string) || 'global';
  try {
    const { data, error } = await supabase
      .from('ai_custom_instructions')
      .select('instructions')
      .eq('user_id', req.userId)
      .eq('provider', provider)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json({ success: true, data: { instructions: data?.instructions || '' } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ success: false, error: message });
  }
});

// POST /api/settings/ai-instructions
router.post('/ai-instructions', authenticate, async (req: Request, res: Response) => {
  const parsed = InstructionsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.issues[0].message });
    return;
  }

  const { provider, instructions } = parsed.data;

  try {
    const { error } = await supabase
      .from('ai_custom_instructions')
      .upsert({
        user_id: req.userId!,
        provider,
        instructions,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,provider' });

    if (error) throw error;

    res.json({ success: true, message: 'Instructions updated successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
