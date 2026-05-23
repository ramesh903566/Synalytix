import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../../../services/ProjectService';

export class ProjectController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.createProject(req.orgId!, req.user!.id, req.body);
      res.status(201).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.getProject(req.orgId!, req.params.id as string);
      res.json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const cursor = req.query.cursor as string;
      const result = await ProjectService.listProjects(req.orgId!, limit, cursor);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.updateProject(req.orgId!, req.params.id as string, req.user!.id, req.body);
      res.json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ProjectService.deleteProject(req.orgId!, req.params.id as string, req.user!.id);
      res.json({ success: true, data: { message: 'Project deleted' } });
    } catch (error) {
      next(error);
    }
  }
}
