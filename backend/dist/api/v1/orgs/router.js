"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authorize_1 = require("../../../middleware/authorize");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Zod validation middleware wrapper
const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
const createOrgSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    slug: zod_1.z.string().min(2).regex(/^[a-z0-9-]+$/),
});
const updateOrgSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    slug: zod_1.z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
});
// Create doesn't require an existing org role, just a user
router.post('/', validate(createOrgSchema), controller_1.OrgController.create);
// Requires roles within the specified org
router.get('/:id', (0, authorize_1.requireRole)('viewer'), controller_1.OrgController.get);
router.patch('/:id', (0, authorize_1.requireRole)('admin'), validate(updateOrgSchema), controller_1.OrgController.update);
router.delete('/:id', (0, authorize_1.requireRole)('owner'), controller_1.OrgController.delete);
exports.default = router;
