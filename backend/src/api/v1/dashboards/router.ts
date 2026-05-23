import { Router } from 'express';
import { DashboardController } from './controller';
import { requireRole } from '../../../middleware/authorize';
import { z } from 'zod';

const router = Router({ mergeParams: true });

const validate = (schema: z.ZodSchema) => (req: any, res: any, next: any) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

const createDashboardSchema = z.object({
  project_id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  layout_json: z.any().optional(),
});

const updateDashboardSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  layout_json: z.any().optional(),
});

router.post('/', requireRole('manager'), validate(createDashboardSchema), DashboardController.create);
router.get('/:id', requireRole('viewer'), DashboardController.get);
router.patch('/:id', requireRole('manager'), validate(updateDashboardSchema), DashboardController.update);
router.delete('/:id', requireRole('manager'), DashboardController.delete);
router.post('/:id/share', requireRole('admin'), DashboardController.share);

export default router;
