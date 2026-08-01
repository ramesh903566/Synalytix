import { Request, Response, NextFunction } from 'express';

// ─── Global Error Handler ─────────────────────────────────────────────────────
// This catches any error thrown by route handlers and returns a clean JSON response.
// Must be registered LAST in Express with app.use(errorHandler)

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  console.error(`[ERROR] ${req.method} ${req.path}`, {
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });

  // Don't leak internal error details outside development
  const message =
    process.env.NODE_ENV === 'development'
      ? error.message
      : 'An internal server error occurred';

  res.status(500).json({
    success: false,
    error: message,
  });
}

// ─── Request Logger ───────────────────────────────────────────────────────────

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const user = req.userId ? `user:${req.userId.slice(0, 8)}` : 'anonymous';
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} → ${res.statusCode} (${duration}ms) [${user}]`
    );
  });

  next();
}

// ─── Not Found Handler ────────────────────────────────────────────────────────

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
}
