import { Worker, Job } from 'bullmq';
import { redis } from '../../lib/redis';
import { prisma } from '../../db/client';

export const csvProcessor = new Worker('dataset-processing', async (job: Job) => {
  const { datasetId, storagePath, orgId } = job.data;
  
  try {
    await prisma.dataset.update({
      where: { id: datasetId },
      data: { status: 'processing' },
    });

    // Simulated processing step:
    // 1. Fetch file from Supabase storage
    // 2. Parse CSV and deduce schema
    // 3. Insert rows into dynamic tenant table or analytics DB
    // 4. Update dataset with row count and schema
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    await prisma.dataset.update({
      where: { id: datasetId },
      data: {
        status: 'ready',
        row_count: 1000,
        schema_json: {
          columns: [{ name: 'id', type: 'string' }, { name: 'value', type: 'number' }]
        }
      },
    });

  } catch (error) {
    console.error(`Failed to process dataset ${datasetId}:`, error);
    await prisma.dataset.update({
      where: { id: datasetId },
      data: { status: 'failed' },
    });
    throw error;
  }
}, { connection: redis });

csvProcessor.on('completed', job => {
  console.log(`Job with id ${job.id} has been completed`);
});

csvProcessor.on('failed', (job, err) => {
  console.log(`Job with id ${job?.id} has failed with ${err.message}`);
});
