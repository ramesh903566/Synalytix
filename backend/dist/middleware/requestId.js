"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestId = requestId;
const nanoid_1 = require("nanoid");
function requestId(req, res, next) {
    req.id = (0, nanoid_1.nanoid)();
    res.setHeader('X-Request-Id', req.id);
    next();
}
