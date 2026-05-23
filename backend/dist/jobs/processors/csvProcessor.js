"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvProcessor = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../lib/redis");
const client_1 = require("../../db/client");
exports.csvProcessor = new bullmq_1.Worker('dataset-processing', async (job) => {
    const { datasetId, storagePath, orgId } = job.data;
    try {
        await client_1.prisma.dataset.update({
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
        await client_1.prisma.dataset.update({
            where: { id: datasetId },
            data: {
                status: 'ready',
                row_count: 1000,
                schema_json: {
                    columns: [{ name: 'id', type: 'string' }, { name: 'value', type: 'number' }]
                }
            },
        });
    }
    catch (error) {
        console.error(`Failed to process dataset ${datasetId}:`, error);
        await client_1.prisma.dataset.update({
            where: { id: datasetId },
            data: { status: 'failed' },
        });
        throw error;
    }
}, { connection: redis_1.redis });
exports.csvProcessor.on('completed', job => {
    console.log(`Job with id ${job.id} has been completed`);
});
exports.csvProcessor.on('failed', (job, err) => {
    console.log(`Job with id ${job?.id} has failed with ${err.message}`);
});
