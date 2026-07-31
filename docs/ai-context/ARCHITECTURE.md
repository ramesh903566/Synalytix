# Synalytix System Architecture

This document outlines the system architecture for Synalytix.

## 1. System Topology & Data Flow

*   **Client Layer**: React SPA built with Vite. Communicates with Supabase via Client SDK and REST APIs for backend services.
*   **Supabase Platform**:
    *   PostgreSQL Database
    *   Supabase Auth (JWT)
    *   Supabase Storage (S3 Media)
    *   Row-Level Security (RLS)
    *   Realtime Subscriptions
*   **Backend / Edge Layer**:
    *   Supabase Edge Functions (Deno/TypeScript) for webhook receiving, polling, AI insights, and broadcasting.
    *   Node.js/Express Backend for OAuth handling and platform data integration.
*   **External APIs**:
    *   Instagram Graph API
    *   X API v2
    *   LinkedIn REST API
    *   GitHub GraphQL + Webhooks
    *   LeetCode GraphQL
    *   Anthropic Claude API

## 2. Database Schema

The primary data store is Supabase PostgreSQL. Key entities include:

*   `users`: Core user accounts.
*   `integration_providers`: Platform definitions (X, LinkedIn, etc.).
*   `user_connections`: Encrypted OAuth tokens for users' platform connections.
*   `activity_logs`: Raw platform events.
*   `metrics_timeseries`: Normalized metrics across all platforms.
*   `ai_briefings`: Generated AI insights.
*   `broadcast_queue`: Scheduled cross-platform posts.
*   `media_assets`: User uploads for posts.

**Security Constraints**:
*   All multi-tenant tables enforce RLS (`auth.uid() = user_id`).
*   OAuth tokens are encrypted using AES-256-GCM.

## 3. Core Engine Components

*   **Metric Normalization Engine**: Translates heterogeneous platform metrics into a canonical taxonomy (e.g., `audience_size`, `content_volume`, `engagement_rate`, `consistency_score`, `growth_velocity`, `quality_signal`).
*   **Digital Presence Score (DPS)**: A flagship composite metric (0–1000) representing the user's entire digital identity strength across 5 platforms.
*   **Cross-Post Studio**: Auto-rewrites a single piece of content into 5 platform-native variants using the Claude API, handling media resizing and platform-specific constraints.
*   **AI Insight Engine**: Analyzes user data to generate daily/weekly actionable insights regarding authenticity gaps, optimal rhythms, and career trajectories.
*   **Placement Readiness Algorithm**: Translates LeetCode + GitHub + LinkedIn data into hiring intelligence for students comparing against cohort benchmarks.

## 4. Frontend Architecture

*   **Routing**: React Router DOM.
*   **Data Fetching**: React Query for remote data, Zustand for local/client state.
*   **Styling**: Tailwind CSS v4, utilizing `@theme` in `index.css`.
*   **UI Components**: Organized modularly (`components/`, `features/`, `modules/`), leaning heavily on Lucide icons and Framer Motion for animations.
