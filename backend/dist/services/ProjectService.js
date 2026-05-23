"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const client_1 = require("../db/client");
const errors_1 = require("../lib/errors");
const ActivityService_1 = require("./ActivityService");
class ProjectService {
    static async createProject(orgId, userId, data) {
        const project = await client_1.prisma.project.create({
            data: {
                organization_id: orgId,
                name: data.name,
                description: data.description,
            },
        });
        await ActivityService_1.ActivityService.log({
            organizationId: orgId,
            userId,
            action: 'CREATE_PROJECT',
            entityType: 'project',
            entityId: project.id,
        });
        return project;
    }
    static async getProject(orgId, projectId) {
        const project = await client_1.prisma.project.findFirst({
            where: { id: projectId, organization_id: orgId, deleted_at: null },
        });
        if (!project)
            throw new errors_1.NotFoundError('Project not found');
        return project;
    }
    static async listProjects(orgId, limit = 20, cursor) {
        const projects = await client_1.prisma.project.findMany({
            where: { organization_id: orgId, deleted_at: null },
            take: limit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { created_at: 'desc' },
        });
        let nextCursor = undefined;
        if (projects.length > limit) {
            const nextItem = projects.pop();
            nextCursor = nextItem?.id;
        }
        return { projects, nextCursor };
    }
    static async updateProject(orgId, projectId, userId, data) {
        const project = await this.getProject(orgId, projectId); // ensures it exists and belongs to org
        const updated = await client_1.prisma.project.update({
            where: { id: project.id },
            data,
        });
        await ActivityService_1.ActivityService.log({
            organizationId: orgId,
            userId,
            action: 'UPDATE_PROJECT',
            entityType: 'project',
            entityId: project.id,
            metadata: data,
        });
        return updated;
    }
    static async deleteProject(orgId, projectId, userId) {
        const project = await this.getProject(orgId, projectId);
        await client_1.prisma.project.update({
            where: { id: project.id },
            data: { deleted_at: new Date() },
        });
        await ActivityService_1.ActivityService.log({
            organizationId: orgId,
            userId,
            action: 'DELETE_PROJECT',
            entityType: 'project',
            entityId: project.id,
        });
        return { success: true };
    }
}
exports.ProjectService = ProjectService;
