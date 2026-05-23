"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatasetService = void 0;
const client_1 = require("../db/client");
const errors_1 = require("../lib/errors");
const StorageService_1 = require("./StorageService");
const datasetQueue_1 = require("../jobs/queues/datasetQueue");
const nanoid_1 = require("nanoid");
class DatasetService {
    static async getUploadUrl(orgId, projectId, filename) {
        // Validate project
        const project = await client_1.prisma.project.findFirst({
            where: { id: projectId, organization_id: orgId },
        });
        if (!project)
            throw new errors_1.NotFoundError('Project not found');
        const path = `${orgId}/${projectId}/${(0, nanoid_1.nanoid)()}-${filename}`;
        const signedUrl = await StorageService_1.StorageService.getSignedUploadUrl('datasets', path);
        return { signedUrl, path };
    }
    static async registerDataset(orgId, projectId, data) {
        const dataset = await client_1.prisma.dataset.create({
            data: {
                organization_id: orgId,
                project_id: projectId,
                name: data.name,
                description: data.description,
                storage_path: data.storage_path,
                status: 'pending',
            },
        });
        // Enqueue processing job
        await datasetQueue_1.datasetQueue.add('process-csv', {
            datasetId: dataset.id,
            storagePath: data.storage_path,
            orgId,
        });
        return dataset;
    }
    static async getDatasetStatus(orgId, datasetId) {
        const dataset = await client_1.prisma.dataset.findFirst({
            where: { id: datasetId, organization_id: orgId },
            select: { id: true, status: true, row_count: true },
        });
        if (!dataset)
            throw new errors_1.NotFoundError('Dataset not found');
        return dataset;
    }
}
exports.DatasetService = DatasetService;
