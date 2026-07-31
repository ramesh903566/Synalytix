import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth';
import dataRoutes from './routes/data';
import recommendationsRoutes from './routes/recommendations';
import settingsRoutes from './routes/settings';
import accountsRoutes from './routes/accounts';
import studioRoutes from './routes/studio';
import chatRoutes from './routes/chat';
import aiProviderRoutes from './routes/ai-providers';
import { errorHandler, requestLogger, notFoundHandler } from './middleware/errorHandler';
import { startTokenRefreshScheduler } from './services/tokenRefresh';
import { startLeetCodeSyncScheduler } from './services/leetcodeCron';

const app = express();
const PORT = process.env.PORT || 4000;


// ─── Security Middleware ──────────────────────────────────────────────────────

// Helmet sets secure HTTP headers
app.use(helmet());

// CORS — only allow your frontend origin
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting — prevent abuse
// 100 requests per 15 minutes per IP for general routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for OAuth routes (increased for testing)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many auth requests. Please wait.' },
});

app.use(generalLimiter);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Request Logging ──────────────────────────────────────────────────────────
app.use(requestLogger);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Synalytix API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? 'development',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/studio', studioRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ai', aiProviderRoutes);

// ─── 404 + Error Handling ─────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════╗');
  console.log('  ║       Synalytix Backend API           ║');
  console.log('  ╚═══════════════════════════════════════╝');
  console.log('');
  console.log(`  🚀  Server running on http://localhost:${PORT}`);
  console.log(`  🌍  Environment: ${process.env.NODE_ENV ?? 'development'}`);
  console.log(`  🔗  Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log('');
  console.log('  Available endpoints:');
  console.log('  GET  /health');
  console.log('  GET  /api/auth/connect/:platform');
  console.log('  GET  /api/auth/callback/:platform');
  console.log('  DELETE /api/auth/disconnect/:platform');
  console.log('  GET  /api/auth/status');
  console.log('  GET  /api/data/summary');
  console.log('  GET  /api/data/github/all');
  console.log('  GET  /api/data/instagram/all');
  console.log('  GET  /api/data/x/all');
  console.log('  GET  /api/data/linkedin/all');
  console.log('  GET  /api/data/leetcode/all');
  console.log('  POST /api/data/leetcode/connect');
  console.log('  POST /api/recommendations/generate');
  console.log('  GET  /api/recommendations/history');
  console.log('  PATCH /api/recommendations/:id/complete');
  console.log('  PATCH /api/recommendations/:id/dismiss');
  console.log('  GET  /api/settings/ai-instructions');
  console.log('  POST /api/settings/ai-instructions');
  console.log('  GET  /api/accounts');
  console.log('');

  // Start background jobs
  if (process.env.NODE_ENV !== 'test') {
    startTokenRefreshScheduler();
    startLeetCodeSyncScheduler();
  }
});

export default app;
