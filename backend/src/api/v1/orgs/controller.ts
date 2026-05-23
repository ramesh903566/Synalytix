import { Request, Response, NextFunction } from 'express';
import { OrgService } from '../../../services/OrgService';

export class OrgController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const org = await OrgService.createOrg(req.user!.id, req.body);
      res.status(201).json({ success: true, data: org });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const org = await OrgService.getOrg(req.params.id as string);
      res.json({ success: true, data: org });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const org = await OrgService.updateOrg(req.params.id as string, req.user!.id, req.body);
      res.json({ success: true, data: org });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await OrgService.deleteOrg(req.params.id as string, req.user!.id);
      res.json({ success: true, data: { message: 'Organization deleted' } });
    } catch (error) {
      next(error);
    }
  }
}
