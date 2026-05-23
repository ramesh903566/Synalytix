import { prisma } from '../db/client';
import { NotFoundError } from '../lib/errors';
import { ActivityService } from './ActivityService';
import { nanoid } from 'nanoid';
import crypto from 'crypto';

export class ApiKeyService {
  static async createKey(orgId: string, userId: string, data: { name: string; permissions?: string[] }) {
    const rawKey = `syn_live_${nanoid(32)}`;
    const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');
    const prefix = rawKey.substring(0, 12);

    const apiKey = await prisma.apiKey.create({
      data: {
        organization_id: orgId,
        name: data.name,
        hashed_key: hashedKey,
        prefix,
        permissions: data.permissions || [],
      },
    });

    await ActivityService.log({
      organizationId: orgId,
      userId,
      action: 'CREATE_API_KEY',
      entityType: 'api_key',
      entityId: apiKey.id,
    });

    return { ...apiKey, key: rawKey }; // Return raw key only once
  }

  static async listKeys(orgId: string) {
    const keys = await prisma.apiKey.findMany({
      where: { organization_id: orgId, deleted_at: null },
      select: {
        id: true,
        name: true,
        prefix: true,
        permissions: true,
        last_used_at: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });
    return keys;
  }

  static async updateKey(orgId: string, keyId: string, userId: string, data: { name?: string; permissions?: string[] }) {
    const key = await prisma.apiKey.findFirst({
      where: { id: keyId, organization_id: orgId, deleted_at: null },
    });

    if (!key) throw new NotFoundError('API Key not found');

    const updated = await prisma.apiKey.update({
      where: { id: key.id },
      data: {
        name: data.name,
        permissions: data.permissions,
      },
      select: {
        id: true,
        name: true,
        prefix: true,
        permissions: true,
        last_used_at: true,
        created_at: true,
      },
    });

    await ActivityService.log({
      organizationId: orgId,
      userId,
      action: 'UPDATE_API_KEY',
      entityType: 'api_key',
      entityId: key.id,
      metadata: data,
    });

    return updated;
  }

  static async deleteKey(orgId: string, keyId: string, userId: string) {
    const key = await prisma.apiKey.findFirst({
      where: { id: keyId, organization_id: orgId, deleted_at: null },
    });

    if (!key) throw new NotFoundError('API Key not found');

    await prisma.apiKey.update({
      where: { id: key.id },
      data: { deleted_at: new Date() },
    });

    await ActivityService.log({
      organizationId: orgId,
      userId,
      action: 'DELETE_API_KEY',
      entityType: 'api_key',
      entityId: key.id,
    });

    return { success: true };
  }
}
