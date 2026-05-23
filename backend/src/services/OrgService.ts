import { prisma } from '../db/client';
import { NotFoundError, ConflictError } from '../lib/errors';
import { ActivityService } from './ActivityService';

export class OrgService {
  static async createOrg(userId: string, data: { name: string; slug: string }) {
    const existing = await prisma.organization.findUnique({ where: { slug: data.slug } });
    if (existing) throw new ConflictError('Organization slug already taken');

    return await prisma.$transaction(async (tx) => {
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

      await ActivityService.log({
        organizationId: org.id,
        userId,
        action: 'CREATE_ORG',
        entityType: 'organization',
        entityId: org.id,
      });

      return org;
    });
  }

  static async getOrg(orgId: string) {
    const org = await prisma.organization.findUnique({ where: { id: orgId, deleted_at: null } });
    if (!org) throw new NotFoundError('Organization not found');
    return org;
  }

  static async updateOrg(orgId: string, userId: string, data: { name?: string; slug?: string }) {
    if (data.slug) {
      const existing = await prisma.organization.findUnique({ where: { slug: data.slug } });
      if (existing && existing.id !== orgId) throw new ConflictError('Slug already taken');
    }

    const org = await prisma.organization.update({
      where: { id: orgId },
      data,
    });

    await ActivityService.log({
      organizationId: org.id,
      userId,
      action: 'UPDATE_ORG',
      entityType: 'organization',
      entityId: org.id,
      metadata: data,
    });

    return org;
  }

  static async deleteOrg(orgId: string, userId: string) {
    const org = await prisma.organization.update({
      where: { id: orgId },
      data: { deleted_at: new Date() },
    });

    await ActivityService.log({
      organizationId: org.id,
      userId,
      action: 'DELETE_ORG',
      entityType: 'organization',
      entityId: org.id,
    });

    return org;
  }
}
