"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errors_1 = require("../lib/errors");
const zod_1 = require("zod");
const logger_1 = require("./logger");
function errorHandler(err, req, res, next) {
    // Zod Validation Error
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid input',
                details: err.format(),
            },
        });
    }
    // Custom App Error
    if (err instanceof errors_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                details: err.details,
            },
        });
    }
    // Unhandled internal error
    logger_1.logger.error('Unhandled Error', {
        error: err.message,
        stack: err.stack,
        requestId: req.id,
    });
    // For 5xx errors, we might want to capture with Sentry (Phase 8)
    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
        },
    });
}
