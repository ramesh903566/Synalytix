"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authorize_1 = require("../../../middleware/authorize");
const zod_1 = require("zod");
const router = (0, express_1.Router)({ mergeParams: true });
const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
const createDashboardSchema = zod_1.z.object({
    project_id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    layout_json: zod_1.z.any().optional(),
});
const updateDashboardSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    layout_json: zod_1.z.any().optional(),
});
router.post('/', (0, authorize_1.requireRole)('manager'), validate(createDashboardSchema), controller_1.DashboardController.create);
router.get('/:id', (0, authorize_1.requireRole)('viewer'), controller_1.DashboardController.get);
router.patch('/:id', (0, authorize_1.requireRole)('manager'), validate(updateDashboardSchema), controller_1.DashboardController.update);
router.delete('/:id', (0, authorize_1.requireRole)('manager'), controller_1.DashboardController.delete);
router.post('/:id/share', (0, authorize_1.requireRole)('admin'), controller_1.DashboardController.share);
exports.default = router;
