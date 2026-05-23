import { Request, Response, NextFunction } from 'express';
import { ActivityService } from '../../../services/ActivityService';

export class ActivityController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const cursor = req.query.cursor as string;
      const result = await ActivityService.getLogs(req.orgId!, limit, cursor);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
