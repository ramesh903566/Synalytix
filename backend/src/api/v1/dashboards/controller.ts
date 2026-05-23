import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../../../services/DashboardService';

export class DashboardController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dashboard = await DashboardService.createDashboard(req.orgId!, req.user!.id, req.body);
      res.status(201).json({ success: true, data: dashboard });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const dashboard = await DashboardService.getDashboard(req.orgId!, req.params.id as string);
      res.json({ success: true, data: dashboard });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const dashboard = await DashboardService.updateDashboard(req.orgId!, req.params.id as string, req.user!.id, req.body);
      res.json({ success: true, data: dashboard });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await DashboardService.deleteDashboard(req.orgId!, req.params.id as string, req.user!.id);
      res.json({ success: true, data: { message: 'Dashboard deleted' } });
    } catch (error) {
      next(error);
    }
  }

  static async share(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await DashboardService.shareDashboard(req.orgId!, req.params.id as string, req.user!.id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
