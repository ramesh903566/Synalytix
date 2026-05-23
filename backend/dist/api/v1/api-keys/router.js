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
const createApiKeySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    permissions: zod_1.z.array(zod_1.z.string()).optional(),
});
const updateApiKeySchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    permissions: zod_1.z.array(zod_1.z.string()).optional(),
});
router.post('/', (0, authorize_1.requireRole)('admin'), validate(createApiKeySchema), controller_1.ApiKeyController.create);
router.get('/', (0, authorize_1.requireRole)('admin'), controller_1.ApiKeyController.list);
router.patch('/:id', (0, authorize_1.requireRole)('admin'), validate(updateApiKeySchema), controller_1.ApiKeyController.update);
router.delete('/:id', (0, authorize_1.requireRole)('admin'), controller_1.ApiKeyController.delete);
exports.default = router;
