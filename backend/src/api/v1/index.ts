import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';

import orgsRouter from './orgs/router';
import projectsRouter from './projects/router';
import apiKeysRouter from './api-keys/router';
import activityRouter from './activity/router';
import datasetsRouter from './datasets/router';
import dashboardsRouter from './dashboards/router';
import insightsRouter from './insights/router';

const router = Router();

// Organizations
router.use('/orgs', authenticate, orgsRouter);

// Nested routes under orgs
router.use('/orgs/:orgId/projects', authenticate, projectsRouter);
router.use('/orgs/:orgId/api-keys', authenticate, apiKeysRouter);
router.use('/orgs/:orgId/activity', authenticate, activityRouter);
router.use('/orgs/:orgId/datasets', authenticate, datasetsRouter);
router.use('/orgs/:orgId/dashboards', authenticate, dashboardsRouter);
router.use('/orgs/:orgId/insights', authenticate, insightsRouter);

export default router;
