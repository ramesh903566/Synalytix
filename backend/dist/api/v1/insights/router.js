"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authorize_1 = require("../../../middleware/authorize");
const router = (0, express_1.Router)({ mergeParams: true });
router.get('/', (0, authorize_1.requireRole)('viewer'), controller_1.InsightController.list);
router.post('/:id/dismiss', (0, authorize_1.requireRole)('manager'), controller_1.InsightController.dismiss);
exports.default = router;
