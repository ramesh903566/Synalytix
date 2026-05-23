import { prisma } from '../db/client';
import { NotFoundError } from '../lib/errors';
import { ActivityService } from './ActivityService';
import { nanoid } from 'nanoid';

export class DashboardService {
  static async createDashboard(orgId: string, userId: string, data: { project_id: string; name: string; description?: string; layout_json?: any }) {
    const dashboard = await prisma.dashboard.create({
      data: {
        organization_id: orgId,
        project_id: data.project_id,
        name: data.name,
        description: data.description,
        layout_json: data.layout_json || {},
      },
    });

    await ActivityService.log({
      organizationId: orgId,
      userId,
      action: 'CREATE_DASHBOARD',
      entityType: 'dashboard',
      entityId: dashboard.id,
    });

    return dashboard;
  }

  static async getDashboard(orgId: string, dashboardId: string) {
    const dashboard = await prisma.dashboard.findFirst({
      where: { id: dashboardId, organization_id: orgId, deleted_at: null },
      include: { widgets: true },
    });
    if (!dashboard) throw new NotFoundError('Dashboard not found');
    return dashboard;
  }

  static async updateDashboard(orgId: string, dashboardId: string, userId: string, data: { name?: string; description?: string; layout_json?: any }) {
    const dashboard = await this.getDashboard(orgId, dashboardId);

    const updated = await prisma.dashboard.update({
      where: { id: dashboard.id },
      data: {
        name: data.name,
        description: data.description,
        layout_json: data.layout_json,
      },
    });

    await ActivityService.log({
      organizationId: orgId,
      userId,
      action: 'UPDATE_DASHBOARD',
      entityType: 'dashboard',
      entityId: dashboard.id,
      metadata: { fields: Object.keys(data) },
    });

    return updated;
  }

  static async deleteDashboard(orgId: string, dashboardId: string, userId: string) {
    const dashboard = await this.getDashboard(orgId, dashboardId);

    await prisma.dashboard.update({
      where: { id: dashboard.id },
      data: { deleted_at: new Date() },
    });

    await ActivityService.log({
      organizationId: orgId,
      userId,
      action: 'DELETE_DASHBOARD',
      entityType: 'dashboard',
      entityId: dashboard.id,
    });

    return { success: true };
  }

  static async shareDashboard(orgId: string, dashboardId: string, userId: string) {
    const dashboard = await this.getDashboard(orgId, dashboardId);
    
    const shareToken = nanoid(16);
    const updated = await prisma.dashboard.update({
      where: { id: dashboard.id },
      data: { is_public: true, share_token: shareToken },
    });

    await ActivityService.log({
      organizationId: orgId,
      userId,
      action: 'SHARE_DASHBOARD',
      entityType: 'dashboard',
      entityId: dashboard.id,
    });

    return { shareToken };
  }
}
