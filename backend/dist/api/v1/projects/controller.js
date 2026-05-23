"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const ProjectService_1 = require("../../../services/ProjectService");
class ProjectController {
    static async create(req, res, next) {
        try {
            const project = await ProjectService_1.ProjectService.createProject(req.orgId, req.user.id, req.body);
            res.status(201).json({ success: true, data: project });
        }
        catch (error) {
            next(error);
        }
    }
    static async get(req, res, next) {
        try {
            const project = await ProjectService_1.ProjectService.getProject(req.orgId, req.params.id);
            res.json({ success: true, data: project });
        }
        catch (error) {
            next(error);
        }
    }
    static async list(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const cursor = req.query.cursor;
            const result = await ProjectService_1.ProjectService.listProjects(req.orgId, limit, cursor);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const project = await ProjectService_1.ProjectService.updateProject(req.orgId, req.params.id, req.user.id, req.body);
            res.json({ success: true, data: project });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await ProjectService_1.ProjectService.deleteProject(req.orgId, req.params.id, req.user.id);
            res.json({ success: true, data: { message: 'Project deleted' } });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProjectController = ProjectController;
