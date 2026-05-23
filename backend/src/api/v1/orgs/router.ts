import { Router } from 'express';
import { OrgController } from './controller';
import { requireRole } from '../../../middleware/authorize';
import { z } from 'zod';

const router = Router();

// Zod validation middleware wrapper
const validate = (schema: z.ZodSchema) => (req: any, res: any, next: any) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

const createOrgSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
});

const updateOrgSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
});

// Create doesn't require an existing org role, just a user
router.post('/', validate(createOrgSchema), OrgController.create);

// Requires roles within the specified org
router.get('/:id', requireRole('viewer'), OrgController.get);
router.patch('/:id', requireRole('admin'), validate(updateOrgSchema), OrgController.update);
router.delete('/:id', requireRole('owner'), OrgController.delete);

export default router;
