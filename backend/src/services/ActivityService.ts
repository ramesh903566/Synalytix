import { prisma } from '../db/client';

interface LogPayload {
  organizationId: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: any;
  ipAddress?: string;
}

export class ActivityService {
  static async log(payload: LogPayload) {
    try {
      await prisma.activityLog.create({
        data: {
          organization_id: payload.organizationId,
          user_id: payload.userId,
          action: payload.action,
          entity_type: payload.entityType,
          entity_id: payload.entityId,
          metadata: payload.metadata,
          ip_address: payload.ipAddress,
        },
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
      // We don't throw here to avoid failing the main request if logging fails
    }
  }

  static async getLogs(orgId: string, limit: number = 50, cursor?: string) {
    const logs = await prisma.activityLog.findMany({
      where: { organization_id: orgId },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { created_at: 'desc' },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    });

    let nextCursor: string | undefined = undefined;
    if (logs.length > limit) {
      const nextItem = logs.pop();
      nextCursor = nextItem?.id;
    }

    return { logs, nextCursor };
  }
}
