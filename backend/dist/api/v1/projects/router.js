"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authorize_1 = require("../../../middleware/authorize");
const zod_1 = require("zod");
const router = (0, express_1.Router)({ mergeParams: true }); // Merge params to get orgId if mounted under /orgs/:orgId/projects
const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
const createProjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
});
const updateProjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
});
router.post('/', (0, authorize_1.requireRole)('manager'), validate(createProjectSchema), controller_1.ProjectController.create);
router.get('/', (0, authorize_1.requireRole)('viewer'), controller_1.ProjectController.list);
router.get('/:id', (0, authorize_1.requireRole)('viewer'), controller_1.ProjectController.get);
router.patch('/:id', (0, authorize_1.requireRole)('manager'), validate(updateProjectSchema), controller_1.ProjectController.update);
router.delete('/:id', (0, authorize_1.requireRole)('admin'), controller_1.ProjectController.delete);
exports.default = router;
