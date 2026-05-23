import { Request, Response, NextFunction } from 'express';
import { ApiKeyService } from '../../../services/ApiKeyService';

export class ApiKeyController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ApiKeyService.createKey(req.orgId!, req.user!.id, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const keys = await ApiKeyService.listKeys(req.orgId!);
      res.json({ success: true, data: keys });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const key = await ApiKeyService.updateKey(req.orgId!, req.params.id as string, req.user!.id, req.body);
      res.json({ success: true, data: key });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ApiKeyService.deleteKey(req.orgId!, req.params.id as string, req.user!.id);
      res.json({ success: true, data: { message: 'API Key deleted' } });
    } catch (error) {
      next(error);
    }
  }
}
