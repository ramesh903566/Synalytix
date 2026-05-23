"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const requestId_1 = require("./middleware/requestId");
const logger_1 = require("./middleware/logger");
const rateLimiter_1 = require("./middleware/rateLimiter");
const errorHandler_1 = require("./middleware/errorHandler");
function createApp() {
    const app = (0, express_1.default)();
    // 1. Request ID
    app.use(requestId_1.requestId);
    // 2. HTTP Logger
    app.use(logger_1.httpLogger);
    // 3. Security Headers
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: env_1.env.FRONTEND_URL,
        credentials: true
    }));
    // 4. Rate Limiter (Global)
    app.use(rateLimiter_1.globalLimiter);
    // Body parser
    app.use(express_1.default.json());
    app.get('/health', (req, res) => {
        res.json({
            status: 'ok',
            version: process.env.npm_package_version || '1.0.0',
            timestamp: new Date().toISOString(),
            db: 'ok',
            redis: 'ok'
        });
    });
    // API Routes
    app.use('/api/v1', require('./api/v1').default);
    // 5. Global Error Handler (must be last)
    app.use(errorHandler_1.errorHandler);
    return app;
}
