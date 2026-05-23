import { Router } from 'express';
import { DatasetController } from './controller';
import { requireRole } from '../../../middleware/authorize';
import { z } from 'zod';

import { aiLimiter } from '../../../middleware/rateLimiter';

const router = Router({ mergeParams: true });

const validate = (schema: z.ZodSchema) => (req: any, res: any, next: any) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

const getUploadUrlSchema = z.object({
  projectId: z.string().uuid(),
  filename: z.string().min(1),
});

const registerSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(1),
  storage_path: z.string().min(1),
  description: z.string().optional(),
});

const nlqSchema = z.object({
  question: z.string().min(3),
});

router.post('/upload-url', requireRole('manager'), validate(getUploadUrlSchema), DatasetController.getUploadUrl);
router.post('/', requireRole('manager'), validate(registerSchema), DatasetController.register);
router.get('/:id/status', requireRole('viewer'), DatasetController.getStatus);
router.post('/:id/query', requireRole('viewer'), DatasetController.query);
router.post('/:id/nlq', requireRole('viewer'), aiLimiter, validate(nlqSchema), DatasetController.nlq);

export default router;
