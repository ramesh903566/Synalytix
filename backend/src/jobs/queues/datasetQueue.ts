import { Queue } from 'bullmq';
import { redis } from '../../lib/redis';

export const datasetQueue = new Queue('dataset-processing', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  },
});
