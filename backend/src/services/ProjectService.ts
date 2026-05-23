import { prisma } from '../db/client';
import { NotFoundError } from '../lib/errors';
import { ActivityService } from './ActivityService';

export class ProjectService {
  static async createProject(orgId: string, userId: string, data: { name: string; description?: string }) {
    const project = await prisma.project.create({
      data: {
        organization_id: orgId,
        name: data.name,
        description: data.description,
      },
    });

    await ActivityService.log({
      organizationId: orgId,
      userId,
      action: 'CREATE_PROJECT',
      entityType: 'project',
      entityId: project.id,
    });

    return project;
  }

  static async getProject(orgId: string, projectId: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, organization_id: orgId, deleted_at: null },
    });
    if (!project) throw new NotFoundError('Project not found');
    return project;
  }

  static async listProjects(orgId: string, limit: number = 20, cursor?: string) {
    const projects = await prisma.project.findMany({
      where: { organization_id: orgId, deleted_at: null },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { created_at: 'desc' },
    });

    let nextCursor: string | undefined = undefined;
    if (projects.length > limit) {
      const nextItem = projects.pop();
      nextCursor = nextItem?.id;
    }

    return { projects, nextCursor };
  }

  static async updateProject(orgId: string, projectId: string, userId: string, data: { name?: string; description?: string }) {
    const project = await this.getProject(orgId, projectId); // ensures it exists and belongs to org

    const updated = await prisma.project.update({
      where: { id: project.id },
      data,
    });

    await ActivityService.log({
      organizationId: orgId,
      userId,
      action: 'UPDATE_PROJECT',
      entityType: 'project',
      entityId: project.id,
      metadata: data,
    });

    return updated;
  }

  static async deleteProject(orgId: string, projectId: string, userId: string) {
    const project = await this.getProject(orgId, projectId);

    await prisma.project.update({
      where: { id: project.id },
      data: { deleted_at: new Date() },
    });

    await ActivityService.log({
      organizationId: orgId,
      userId,
      action: 'DELETE_PROJECT',
      entityType: 'project',
      entityId: project.id,
    });

    return { success: true };
  }
}
