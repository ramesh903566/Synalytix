import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors';
import { ZodError } from 'zod';
import { logger } from './logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Zod Validation Error
  if (err instanceof ZodError) {
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
  if (err instanceof AppError) {
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
  logger.error('Unhandled Error', {
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
