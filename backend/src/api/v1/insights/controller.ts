import { Request, Response, NextFunction } from 'express';
import { AnomalyService } from '../../../services/AnomalyService';

export class InsightController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      // In a real API we would extract projectId from query params or route
      const projectId = req.query.projectId as string || 'default';
      const limit = parseInt(req.query.limit as string) || 20;
      const insights = await AnomalyService.getInsights(req.orgId!, projectId, limit);
      res.json({ success: true, data: insights });
    } catch (error) {
      next(error);
    }
  }

  static async dismiss(req: Request, res: Response, next: NextFunction) {
    try {
      await AnomalyService.dismissInsight(req.orgId!, req.params.id as string, req.user!.id);
      res.json({ success: true, data: { message: 'Insight dismissed' } });
    } catch (error) {
      next(error);
    }
  }
}
