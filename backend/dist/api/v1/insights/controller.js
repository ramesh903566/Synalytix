"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightController = void 0;
const AnomalyService_1 = require("../../../services/AnomalyService");
class InsightController {
    static async list(req, res, next) {
        try {
            // In a real API we would extract projectId from query params or route
            const projectId = req.query.projectId || 'default';
            const limit = parseInt(req.query.limit) || 20;
            const insights = await AnomalyService_1.AnomalyService.getInsights(req.orgId, projectId, limit);
            res.json({ success: true, data: insights });
        }
        catch (error) {
            next(error);
        }
    }
    static async dismiss(req, res, next) {
        try {
            await AnomalyService_1.AnomalyService.dismissInsight(req.orgId, req.params.id, req.user.id);
            res.json({ success: true, data: { message: 'Insight dismissed' } });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.InsightController = InsightController;
