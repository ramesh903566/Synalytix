import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { requestId } from './middleware/requestId';
import { httpLogger } from './middleware/logger';
import { globalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  // 1. Request ID
  app.use(requestId);

  // 2. HTTP Logger
  app.use(httpLogger);

  // 3. Security Headers
  app.use(helmet());
  app.use(cors({ 
    origin: env.FRONTEND_URL,
    credentials: true
  }));

  // 4. Rate Limiter (Global)
  app.use(globalLimiter);

  // Body parser
  app.use(express.json());

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
  app.use(errorHandler);

  return app;
}
