"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgService = void 0;
const client_1 = require("../db/client");
const errors_1 = require("../lib/errors");
const ActivityService_1 = require("./ActivityService");
class OrgService {
    static async createOrg(userId, data) {
        const existing = await client_1.prisma.organization.findUnique({ where: { slug: data.slug } });
        if (existing)
            throw new errors_1.ConflictError('Organization slug already taken');
        return await client_1.prisma.$transaction(async (tx) => {
            const org = await tx.organization.create({
                data: {
                    name: data.name,
                    slug: data.slug,
                    members: {
                        create: {
                            user_id: userId,
                            role: 'owner',
                        },
                    },
                },
            });
            await ActivityService_1.ActivityService.log({
                organizationId: org.id,
                userId,
                action: 'CREATE_ORG',
                entityType: 'organization',
                entityId: org.id,
            });
            return org;
        });
    }
    static async getOrg(orgId) {
        const org = await client_1.prisma.organization.findUnique({ where: { id: orgId, deleted_at: null } });
        if (!org)
            throw new errors_1.NotFoundError('Organization not found');
        return org;
    }
    static async updateOrg(orgId, userId, data) {
        if (data.slug) {
            const existing = await client_1.prisma.organization.findUnique({ where: { slug: data.slug } });
            if (existing && existing.id !== orgId)
                throw new errors_1.ConflictError('Slug already taken');
        }
        const org = await client_1.prisma.organization.update({
            where: { id: orgId },
            data,
        });
        await ActivityService_1.ActivityService.log({
            organizationId: org.id,
            userId,
            action: 'UPDATE_ORG',
            entityType: 'organization',
            entityId: org.id,
            metadata: data,
        });
        return org;
    }
    static async deleteOrg(orgId, userId) {
        const org = await client_1.prisma.organization.update({
            where: { id: orgId },
            data: { deleted_at: new Date() },
        });
        await ActivityService_1.ActivityService.log({
            organizationId: org.id,
            userId,
            action: 'DELETE_ORG',
            entityType: 'organization',
            entityId: org.id,
        });
        return org;
    }
}
exports.OrgService = OrgService;
