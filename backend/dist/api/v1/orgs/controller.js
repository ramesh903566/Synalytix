"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgController = void 0;
const OrgService_1 = require("../../../services/OrgService");
class OrgController {
    static async create(req, res, next) {
        try {
            const org = await OrgService_1.OrgService.createOrg(req.user.id, req.body);
            res.status(201).json({ success: true, data: org });
        }
        catch (error) {
            next(error);
        }
    }
    static async get(req, res, next) {
        try {
            const org = await OrgService_1.OrgService.getOrg(req.params.id);
            res.json({ success: true, data: org });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const org = await OrgService_1.OrgService.updateOrg(req.params.id, req.user.id, req.body);
            res.json({ success: true, data: org });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await OrgService_1.OrgService.deleteOrg(req.params.id, req.user.id);
            res.json({ success: true, data: { message: 'Organization deleted' } });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrgController = OrgController;
