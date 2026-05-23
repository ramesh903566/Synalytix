"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatasetController = void 0;
const DatasetService_1 = require("../../../services/DatasetService");
const QueryBuilderService_1 = require("../../../services/QueryBuilderService");
const AiService_1 = require("../../../services/AiService");
class DatasetController {
    static async getUploadUrl(req, res, next) {
        try {
            const { projectId, filename } = req.body;
            const result = await DatasetService_1.DatasetService.getUploadUrl(req.orgId, projectId, filename);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async register(req, res, next) {
        try {
            const { projectId, name, storage_path, description } = req.body;
            const dataset = await DatasetService_1.DatasetService.registerDataset(req.orgId, projectId, { name, storage_path, description });
            res.status(201).json({ success: true, data: dataset });
        }
        catch (error) {
            next(error);
        }
    }
    static async getStatus(req, res, next) {
        try {
            const status = await DatasetService_1.DatasetService.getDatasetStatus(req.orgId, req.params.id);
            res.json({ success: true, data: status });
        }
        catch (error) {
            next(error);
        }
    }
    static async query(req, res, next) {
        try {
            const result = await QueryBuilderService_1.QueryBuilderService.executeQuery(req.orgId, req.params.id, req.body);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async nlq(req, res, next) {
        try {
            const { question } = req.body;
            const result = await AiService_1.AiService.processNlq(req.orgId, req.params.id, req.user.id, question);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DatasetController = DatasetController;
