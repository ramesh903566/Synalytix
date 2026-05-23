"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyController = void 0;
const ApiKeyService_1 = require("../../../services/ApiKeyService");
class ApiKeyController {
    static async create(req, res, next) {
        try {
            const result = await ApiKeyService_1.ApiKeyService.createKey(req.orgId, req.user.id, req.body);
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async list(req, res, next) {
        try {
            const keys = await ApiKeyService_1.ApiKeyService.listKeys(req.orgId);
            res.json({ success: true, data: keys });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const key = await ApiKeyService_1.ApiKeyService.updateKey(req.orgId, req.params.id, req.user.id, req.body);
            res.json({ success: true, data: key });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await ApiKeyService_1.ApiKeyService.deleteKey(req.orgId, req.params.id, req.user.id);
            res.json({ success: true, data: { message: 'API Key deleted' } });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ApiKeyController = ApiKeyController;
