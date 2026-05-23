import { Router } from 'express';
import { ActivityController } from './controller';
import { requireRole } from '../../../middleware/authorize';

const router = Router({ mergeParams: true });

router.get('/', requireRole('admin'), ActivityController.list);

export default router;
