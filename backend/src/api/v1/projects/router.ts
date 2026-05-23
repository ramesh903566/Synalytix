import { Router } from 'express';
import { ProjectController } from './controller';
import { requireRole } from '../../../middleware/authorize';
import { z } from 'zod';

const router = Router({ mergeParams: true }); // Merge params to get orgId if mounted under /orgs/:orgId/projects

const validate = (schema: z.ZodSchema) => (req: any, res: any, next: any) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

router.post('/', requireRole('manager'), validate(createProjectSchema), ProjectController.create);
router.get('/', requireRole('viewer'), ProjectController.list);
router.get('/:id', requireRole('viewer'), ProjectController.get);
router.patch('/:id', requireRole('manager'), validate(updateProjectSchema), ProjectController.update);
router.delete('/:id', requireRole('admin'), ProjectController.delete);

export default router;
