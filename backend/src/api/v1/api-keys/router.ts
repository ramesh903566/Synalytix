import { Router } from 'express';
import { ApiKeyController } from './controller';
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

const createApiKeySchema = z.object({
  name: z.string().min(1),
  permissions: z.array(z.string()).optional(),
});

const updateApiKeySchema = z.object({
  name: z.string().min(1).optional(),
  permissions: z.array(z.string()).optional(),
});

router.post('/', requireRole('admin'), validate(createApiKeySchema), ApiKeyController.create);
router.get('/', requireRole('admin'), ApiKeyController.list);
router.patch('/:id', requireRole('admin'), validate(updateApiKeySchema), ApiKeyController.update);
router.delete('/:id', requireRole('admin'), ApiKeyController.delete);

export default router;
