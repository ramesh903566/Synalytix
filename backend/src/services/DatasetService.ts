import { prisma } from '../db/client';
import { NotFoundError } from '../lib/errors';
import { StorageService } from './StorageService';
import { datasetQueue } from '../jobs/queues/datasetQueue';
import { nanoid } from 'nanoid';

export class DatasetService {
  static async getUploadUrl(orgId: string, projectId: string, filename: string) {
    // Validate project
    const project = await prisma.project.findFirst({
      where: { id: projectId, organization_id: orgId },
    });
    if (!project) throw new NotFoundError('Project not found');

    const path = `${orgId}/${projectId}/${nanoid()}-${filename}`;
    const signedUrl = await StorageService.getSignedUploadUrl('datasets', path);

    return { signedUrl, path };
  }

  static async registerDataset(orgId: string, projectId: string, data: { name: string; storage_path: string; description?: string }) {
    const dataset = await prisma.dataset.create({
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
    await datasetQueue.add('process-csv', {
      datasetId: dataset.id,
      storagePath: data.storage_path,
      orgId,
    });

    return dataset;
  }

  static async getDatasetStatus(orgId: string, datasetId: string) {
    const dataset = await prisma.dataset.findFirst({
      where: { id: datasetId, organization_id: orgId },
      select: { id: true, status: true, row_count: true },
    });
    if (!dataset) throw new NotFoundError('Dataset not found');
    return dataset;
  }
}
