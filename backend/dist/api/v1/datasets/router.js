"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authorize_1 = require("../../../middleware/authorize");
const zod_1 = require("zod");
const rateLimiter_1 = require("../../../middleware/rateLimiter");
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
const getUploadUrlSchema = zod_1.z.object({
    projectId: zod_1.z.string().uuid(),
    filename: zod_1.z.string().min(1),
});
const registerSchema = zod_1.z.object({
    projectId: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    storage_path: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
});
const nlqSchema = zod_1.z.object({
    question: zod_1.z.string().min(3),
});
router.post('/upload-url', (0, authorize_1.requireRole)('manager'), validate(getUploadUrlSchema), controller_1.DatasetController.getUploadUrl);
router.post('/', (0, authorize_1.requireRole)('manager'), validate(registerSchema), controller_1.DatasetController.register);
router.get('/:id/status', (0, authorize_1.requireRole)('viewer'), controller_1.DatasetController.getStatus);
router.post('/:id/query', (0, authorize_1.requireRole)('viewer'), controller_1.DatasetController.query);
router.post('/:id/nlq', (0, authorize_1.requireRole)('viewer'), rateLimiter_1.aiLimiter, validate(nlqSchema), controller_1.DatasetController.nlq);
exports.default = router;
