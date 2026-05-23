"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const DashboardService_1 = require("../../../services/DashboardService");
class DashboardController {
    static async create(req, res, next) {
        try {
            const dashboard = await DashboardService_1.DashboardService.createDashboard(req.orgId, req.user.id, req.body);
            res.status(201).json({ success: true, data: dashboard });
        }
        catch (error) {
            next(error);
        }
    }
    static async get(req, res, next) {
        try {
            const dashboard = await DashboardService_1.DashboardService.getDashboard(req.orgId, req.params.id);
            res.json({ success: true, data: dashboard });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const dashboard = await DashboardService_1.DashboardService.updateDashboard(req.orgId, req.params.id, req.user.id, req.body);
            res.json({ success: true, data: dashboard });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await DashboardService_1.DashboardService.deleteDashboard(req.orgId, req.params.id, req.user.id);
            res.json({ success: true, data: { message: 'Dashboard deleted' } });
        }
        catch (error) {
            next(error);
        }
    }
    static async share(req, res, next) {
        try {
            const result = await DashboardService_1.DashboardService.shareDashboard(req.orgId, req.params.id, req.user.id);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DashboardController = DashboardController;
