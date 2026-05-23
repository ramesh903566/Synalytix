import { Request, Response, NextFunction } from 'express';
import { DatasetService } from '../../../services/DatasetService';
import { QueryBuilderService } from '../../../services/QueryBuilderService';
import { AiService } from '../../../services/AiService';

export class DatasetController {
  static async getUploadUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId, filename } = req.body;
      const result = await DatasetService.getUploadUrl(req.orgId!, projectId, filename);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId, name, storage_path, description } = req.body;
      const dataset = await DatasetService.registerDataset(req.orgId!, projectId, { name, storage_path, description });
      res.status(201).json({ success: true, data: dataset });
    } catch (error) {
      next(error);
    }
  }

  static async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const status = await DatasetService.getDatasetStatus(req.orgId!, req.params.id as string);
      res.json({ success: true, data: status });
    } catch (error) {
      next(error);
    }
  }

  static async query(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await QueryBuilderService.executeQuery(req.orgId!, req.params.id as string, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async nlq(req: Request, res: Response, next: NextFunction) {
    try {
      const { question } = req.body;
      const result = await AiService.processNlq(req.orgId!, req.params.id as string, req.user!.id, question);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
