# Synalytix - AI Context Document

**Purpose**: This document provides a high-level summary of the Synalytix project architecture, tech stack, and current state. It is designed to quickly onboard other AI models to the project without requiring them to parse the entire codebase or extensive documentation up front. For deep technical details, refer to `TDR.md` and `PRD.md`.

## Project Overview
**Synalytix** is a unified digital identity analytics platform. It aggregates user activity data from five platforms (GitHub, LinkedIn, X/Twitter, LeetCode, and Instagram) and uses AI (Anthropic Claude) to produce career recommendations, personal branding insights, and opportunity alerts.

## Architecture
The system follows a classic decoupled client-server architecture:
- **Frontend (Client)**: A Single Page Application (SPA) built with React 19 and Vite.
- **Backend (API)**: A REST API server built with Node.js and Express.
- **Data Layer**: Supabase (PostgreSQL 15 with Row Level Security) as the primary database and Auth provider. Redis is used for caching.
- **External APIs**: Anthropic Claude API for AI recommendations, and OAuth 2.0 integration with the 5 supported platforms.

## Tech Stack
### Frontend (`/frontend`)
- **Framework**: React 19.0.1, TypeScript 5.8
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4, Lucide React (Icons)
- **State Management**:
  - **Global/Local**: Zustand, React Context
  - **Server/API**: TanStack React Query 5
- **Routing**: React Router DOM 7
- **UI Libraries**: Recharts (charts), Framer Motion (animations), Spline (3D rendering for landing page), TanStack React Table
- **Validation**: Zod (matching backend schemas)

### Backend (`/backend`)
- **Runtime & Framework**: Node.js 20.x, Express 4.18, TypeScript 5.3
- **Database & Auth**: Supabase JS Client (PostgreSQL), jsonwebtoken
- **Caching**: ioredis (Redis 6+)
- **Validation**: Zod 3.22
- **Security**: Helmet, CORS, express-rate-limit, AES-256-GCM encryption for OAuth tokens
- **AI Integration**: Anthropic AI SDK (`claude-3-opus`)
- **Background Jobs**: node-cron (for token refreshing)

## Directory Structure
- `/frontend/src/`: Contains the React SPA. Key directories include `components/` (UI pieces), `pages/` (routes), `hooks/` (React Query), `store/` (Zustand), `lib/` (utilities & mock API).
- `/backend/src/`: Contains the Express app. Key directories include `routes/` (API endpoints), `services/` (business logic for platforms and recommendations), `middleware/` (Auth & Error handling), `lib/` (Supabase, Redis, Crypto, AI integration).
- `/backend/supabase/migrations/`: Database schema and RLS policies.
- `/docs/`, `TDR.md`, `PRD.md`: Extensive product and technical requirements documents.

## Current State & Known Limitations
- **Backend**: Substantially implemented, including DB schema, Auth endpoints, AI recommendation engine, and OAuth integration flows.
- **Frontend**: Currently a functional prototype relying heavily on **mock data** (`frontend/src/data/mockData.ts`) and **mock authentication** (auto-authenticates in dev mode).
- **Integration Status**: The frontend is *not yet fully wired* to the real backend endpoints. The `lib/api.ts` file in the frontend currently serves mock responses.
- **Data Encryption**: OAuth tokens (access & refresh tokens) are encrypted before being stored in the database.

## Key Workflows
1. **Authentication**: Handled via Supabase (Email/Password or GitHub OAuth). JWTs are attached to the `Authorization` header and verified in backend middleware.
2. **Platform Connection**: Users trigger OAuth flows. The backend generates CSRF states, handles callbacks, exchanges tokens, encrypts them, and saves to the `platform_connections` table.
3. **Analytics Aggregation**: The backend fetches data from connected platform APIs, caches it in Redis/Supabase `api_cache`, and serves it to the frontend.
4. **AI Recommendations**: Triggering a recommendation generation fetches all live platform data, constructs a unified prompt, calls Anthropic Claude, scores the user across 4 dimensions (Career, Employability, Branding, Technical), and saves actionable tasks to the DB.

## Development Guidelines for AI Models
- **Stay aligned with the Stack**: Use Tailwind for styling, Zod for validation, React Query for fetching, and Express for backend endpoints.
- **Reference existing schemas**: When manipulating the database, check `backend/supabase/migrations/` for exact table names and columns.
- **Respect the Mock vs. Real boundary**: Be aware that frontend API calls currently hit mock functions. When asked to implement features, clarify if you are wiring the frontend to the backend or extending the mock system.
- **Security**: Never expose unencrypted OAuth tokens to the frontend; rely on the backend `crypto.ts` functions for handling sensitive token data.
