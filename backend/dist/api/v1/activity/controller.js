"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityController = void 0;
const ActivityService_1 = require("../../../services/ActivityService");
class ActivityController {
    static async list(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 50;
            const cursor = req.query.cursor;
            const result = await ActivityService_1.ActivityService.getLogs(req.orgId, limit, cursor);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ActivityController = ActivityController;
