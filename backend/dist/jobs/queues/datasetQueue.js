"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.datasetQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../lib/redis");
exports.datasetQueue = new bullmq_1.Queue('dataset-processing', {
    connection: redis_1.redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
    },
});
