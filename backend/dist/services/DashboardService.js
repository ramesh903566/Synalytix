"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const client_1 = require("../db/client");
const errors_1 = require("../lib/errors");
const ActivityService_1 = require("./ActivityService");
const nanoid_1 = require("nanoid");
class DashboardService {
    static async createDashboard(orgId, userId, data) {
        const dashboard = await client_1.prisma.dashboard.create({
            data: {
                organization_id: orgId,
                project_id: data.project_id,
                name: data.name,
                description: data.description,
                layout_json: data.layout_json || {},
            },
        });
        await ActivityService_1.ActivityService.log({
            organizationId: orgId,
            userId,
            action: 'CREATE_DASHBOARD',
            entityType: 'dashboard',
            entityId: dashboard.id,
        });
        return dashboard;
    }
    static async getDashboard(orgId, dashboardId) {
        const dashboard = await client_1.prisma.dashboard.findFirst({
            where: { id: dashboardId, organization_id: orgId, deleted_at: null },
            include: { widgets: true },
        });
        if (!dashboard)
            throw new errors_1.NotFoundError('Dashboard not found');
        return dashboard;
    }
    static async updateDashboard(orgId, dashboardId, userId, data) {
        const dashboard = await this.getDashboard(orgId, dashboardId);
        const updated = await client_1.prisma.dashboard.update({
            where: { id: dashboard.id },
            data: {
                name: data.name,
                description: data.description,
                layout_json: data.layout_json,
            },
        });
        await ActivityService_1.ActivityService.log({
            organizationId: orgId,
            userId,
            action: 'UPDATE_DASHBOARD',
            entityType: 'dashboard',
            entityId: dashboard.id,
            metadata: { fields: Object.keys(data) },
        });
        return updated;
    }
    static async deleteDashboard(orgId, dashboardId, userId) {
        const dashboard = await this.getDashboard(orgId, dashboardId);
        await client_1.prisma.dashboard.update({
            where: { id: dashboard.id },
            data: { deleted_at: new Date() },
        });
        await ActivityService_1.ActivityService.log({
            organizationId: orgId,
            userId,
            action: 'DELETE_DASHBOARD',
            entityType: 'dashboard',
            entityId: dashboard.id,
        });
        return { success: true };
    }
    static async shareDashboard(orgId, dashboardId, userId) {
        const dashboard = await this.getDashboard(orgId, dashboardId);
        const shareToken = (0, nanoid_1.nanoid)(16);
        const updated = await client_1.prisma.dashboard.update({
            where: { id: dashboard.id },
            data: { is_public: true, share_token: shareToken },
        });
        await ActivityService_1.ActivityService.log({
            organizationId: orgId,
            userId,
            action: 'SHARE_DASHBOARD',
            entityType: 'dashboard',
            entityId: dashboard.id,
        });
        return { shareToken };
    }
}
exports.DashboardService = DashboardService;
