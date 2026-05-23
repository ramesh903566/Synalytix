"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../../middleware/authenticate");
const router_1 = __importDefault(require("./orgs/router"));
const router_2 = __importDefault(require("./projects/router"));
const router_3 = __importDefault(require("./api-keys/router"));
const router_4 = __importDefault(require("./activity/router"));
const router_5 = __importDefault(require("./datasets/router"));
const router_6 = __importDefault(require("./dashboards/router"));
const router_7 = __importDefault(require("./insights/router"));
const router = (0, express_1.Router)();
// Organizations
router.use('/orgs', authenticate_1.authenticate, router_1.default);
// Nested routes under orgs
router.use('/orgs/:orgId/projects', authenticate_1.authenticate, router_2.default);
router.use('/orgs/:orgId/api-keys', authenticate_1.authenticate, router_3.default);
router.use('/orgs/:orgId/activity', authenticate_1.authenticate, router_4.default);
router.use('/orgs/:orgId/datasets', authenticate_1.authenticate, router_5.default);
router.use('/orgs/:orgId/dashboards', authenticate_1.authenticate, router_6.default);
router.use('/orgs/:orgId/insights', authenticate_1.authenticate, router_7.default);
exports.default = router;
