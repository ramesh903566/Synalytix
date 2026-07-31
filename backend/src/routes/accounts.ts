import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { ConnectionService } from '../services/connectionService';

const router = Router();

// GET /api/accounts
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const connections = await ConnectionService.getAllForUser(req.userId!);
    
    const accounts = ['github', 'linkedin', 'x', 'instagram', 'leetcode', 'google-calendar'].map(platform => {
      const conn = connections.find(c => c.platform === platform);
      return {
        platform,
        status: conn ? 'active' : 'disconnected',
        connectedAt: conn ? conn.created_at : null,
        lastSynced: conn ? (conn as any).last_synced || conn.updated_at : null,
        username: conn ? conn.platform_username : null,
        xCapabilities: conn ? (conn as any).x_capabilities || [] : [],
      };
    });

    res.json({ success: true, data: accounts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
