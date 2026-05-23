"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const client_1 = require("../db/client");
class ActivityService {
    static async log(payload) {
        try {
            await client_1.prisma.activityLog.create({
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
        }
        catch (error) {
            console.error('Failed to log activity:', error);
            // We don't throw here to avoid failing the main request if logging fails
        }
    }
    static async getLogs(orgId, limit = 50, cursor) {
        const logs = await client_1.prisma.activityLog.findMany({
            where: { organization_id: orgId },
            take: limit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { created_at: 'desc' },
            include: {
                user: { select: { id: true, email: true, name: true } },
            },
        });
        let nextCursor = undefined;
        if (logs.length > limit) {
            const nextItem = logs.pop();
            nextCursor = nextItem?.id;
        }
        return { logs, nextCursor };
    }
}
exports.ActivityService = ActivityService;
