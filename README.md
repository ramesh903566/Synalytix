# Synalytix

Unified digital identity analytics platform. Aggregates data from GitHub, Instagram, X/Twitter, LinkedIn, and LeetCode. Applies AI-powered analysis via Google Gemini and delivers career-oriented recommendations.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, Recharts |
| Backend | Node.js, Express, TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (JWT) |
| AI | Google Gemini (`@google/genai`) |
| State | Zustand + React Query |

## Project Structure

```
Synalytix/
├── frontend/          # Vite + React SPA
│   ├── src/
│   │   ├── components/    # Reusable UI (ErrorBoundary, cards, recommendations)
│   │   ├── pages/         # Route pages (Dashboard, Auth, Studio, Planner, etc.)
│   │   ├── features/      # Platform-specific modules (GitHub, LinkedIn)
│   │   ├── modules/       # X Analytics module
│   │   ├── hooks/         # Custom hooks (useRecommendations)
│   │   ├── store/         # Zustand stores
│   │   ├── context/       # React context (AppContext)
│   │   ├── lib/           # API client, Supabase, utilities
│   │   ├── types/         # TypeScript types
│   │   └── data/          # Mock data
│   └── vite.config.ts
│
├── backend/           # Express API server
│   ├── src/
│   │   ├── routes/        # Express route handlers
│   │   ├── services/      # Business logic (OAuth, platform APIs, token refresh)
│   │   ├── middleware/    # Auth, error handling
│   │   ├── lib/           # Supabase client, encryption, AI provider, Redis
│   │   └── types/         # TypeScript types
│   └── tsconfig.json
│
└── PRD.md             # Product Requirements Document
```

## Quick Start

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- Platform developer accounts (GitHub, Meta, X, LinkedIn) for OAuth

### 1. Frontend

```bash
cd frontend
npm install
cp .env.example .env    # Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
npm run dev             # http://localhost:5173
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env    # Fill in all variables (see below)
npm run dev             # http://localhost:4000
```

### 3. Environment Variables

**Frontend** (`.env`):

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_API_URL` | Backend API URL (default: `http://localhost:4000/api`) |

**Backend** (`.env`):

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 4000) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (never expose to frontend) |
| `JWT_SECRET` | Supabase JWT secret from dashboard |
| `FRONTEND_URL` | Frontend origin for CORS (default: `http://localhost:5173`) |
| `ENCRYPTION_SECRET` | 32+ char secret for AES-256-GCM token encryption |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth app credentials |
| `META_APP_ID` / `META_APP_SECRET` | Meta/Instagram app credentials |
| `X_CLIENT_ID` / `X_CLIENT_SECRET` | X/Twitter OAuth 2.0 credentials |
| `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET` | LinkedIn OAuth credentials |

## Features

- **AI Context Architecture** — Modular documentation system for efficient AI agent integration and context management.
- **Modern Design System** — Tailwind v4 based design language with seamless responsive layouts.

- **Dashboard** — Unified overview with KPI cards, charts, network health
- **Platform Analytics** — Deep-dive per platform (GitHub repos/contributions, Instagram insights, X tweets, LinkedIn posts, LeetCode stats)
- **AI Recommendations** — Gemini-powered career scoring and prioritized recommendations
- **Content Studio** — AI-optimized post drafting and scheduling across platforms
- **Planner** — Calendar-based task management with drag-and-drop
- **Settings** — Account management, connection management, preferences

## API Endpoints

All protected routes require `Authorization: Bearer <supabase_jwt>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/auth/connect/:platform` | Start OAuth flow |
| GET | `/api/auth/callback/:platform` | OAuth callback |
| DELETE | `/api/auth/disconnect/:platform` | Remove connection |
| GET | `/api/auth/status` | Connected platforms |
| GET | `/api/data/summary` | All platforms summary |
| GET | `/api/data/github/all` | GitHub data |
| GET | `/api/data/instagram/all` | Instagram data |
| GET | `/api/data/x/all` | X data |
| GET | `/api/data/linkedin/all` | LinkedIn data |
| GET | `/api/data/leetcode/all` | LeetCode data |
| POST | `/api/data/leetcode/connect` | Connect LeetCode by username |
| POST | `/api/recommendations/generate` | Generate AI recommendations |
| GET | `/api/recommendations` | Get recommendations |
| PATCH | `/api/recommendations/:id/complete` | Mark complete |
| PATCH | `/api/recommendations/:id/dismiss` | Dismiss |

## Build

```bash
# Frontend
cd frontend && npm run build    # Output: frontend/dist/

# Backend
cd backend && npm run build     # Output: backend/dist/
```

## Security

- All OAuth tokens encrypted with AES-256-GCM before database storage
- JWT verification on all protected routes via Supabase middleware
- Rate limiting: 100 req/15min general, 100 req/15min auth
- CORS restricted to configured frontend origin
- Helmet security headers enabled
- Body size limit: 10KB
- OAuth CSRF state tokens with 10-minute expiry
- PKCE flow for X/Twitter OAuth 2.0

## Production Status

| Check | Status |
|-------|--------|
| TypeScript | 0 errors (frontend + backend) |
| Build | Passes (frontend + backend) |
| Auth | Mocked (dev mode auto-authenticates) |
| Data | Mocked (frontend API calls return mock data) |
| Tests | No test framework configured |

## Known Limitations

- Frontend is not wired to real backend (mock data throughout)
- No test framework or test suite
- TypeScript strict mode not enabled on frontend
- Planner state not persisted to backend (Zustand only)
- Content posting to platforms not implemented
- No ESLint/Prettier configuration
- Bundle size: react-spline (2MB) and physics engine (2MB) chunks need code splitting

## License

Private — Synalytix Engineering
