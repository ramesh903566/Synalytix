import { Router } from 'express';
import { InsightController } from './controller';
import { requireRole } from '../../../middleware/authorize';

const router = Router({ mergeParams: true });

router.get('/', requireRole('viewer'), InsightController.list);
router.post('/:id/dismiss', requireRole('manager'), InsightController.dismiss);

export default router;
