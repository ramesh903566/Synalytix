# Synalytix Project Context

This is the primary context file for the Synalytix project.
**Always read this file first before making changes.**
If information is missing, update the relevant file in this directory after discovering it.

## Working Rules
*   **Always read `PROJECT_CONTEXT.md` first.**
*   Read only the additional context file(s) relevant to the current task (e.g., `DESIGN_SYSTEM.md` for UI work or `ARCHITECTURE.md` for backend work).
*   **Update only the affected context files** after completing a task.
*   Treat `docs/ai-context/` as the project's living memory.
*   DO NOT recursively scan the repository to "understand the project".

## Context Files Index

*   `PROJECT_CONTEXT.md` (this file): High-level overview
*   `ARCHITECTURE.md`: System architecture (Frontend, Backend, Database)
*   `FEATURES.md`: Feature documentation
*   `API_REFERENCE.md`: API endpoints
*   `DESIGN_SYSTEM.md`: UI/UX guidelines
*   `CHANGELOG.md`: Every AI change
*   `CURRENT_TASKS.md`: Active work, bugs, technical debt
*   `KNOWLEDGE_BASE.md`: Decisions, conventions, patterns

## Project Overview

*   **Project Name**: Synalytix
*   **Tagline**: *One Dashboard. Five Platforms. Your Complete Digital Identity.*
*   **Purpose**: A unified SaaS dashboard that connects to Instagram, X, LinkedIn, GitHub, and LeetCode to aggregate metrics into a single Digital Presence Score (DPS), analyze patterns, advise via AI, and broadcast content cross-platform.
*   **Target Users**: CS Students, DevRel, Internship Hunters, Campus Ambassadors, Open Source Builders.

## Tech Stack

*   **Frontend**: React 19, Vite, TypeScript, React Router, Tailwind CSS v4
*   **Backend**: Node.js, Express, TypeScript (OAuth + Platform Data)
*   **Database**: Supabase (PostgreSQL)
*   **Authentication**: Supabase Auth (JWT)
*   **State Management**: Zustand, React Query
*   **UI Library**: Custom Tailwind/Lucide (shadcn/ui-like patterns), Motion (Framer), Radix UI
*   **Charts**: Recharts
*   **Third-party APIs**: Anthropic Claude API (AI), Platform APIs (Insta, X, LinkedIn, GitHub, LeetCode)
*   **Caching**: Redis (ioredis)

## High-Level Folder Structure

*   `frontend/`: React SPA
    *   `src/components/`: Reusable UI elements
    *   `src/features/`: Feature-specific logic (e.g., linkedin)
    *   `src/modules/`: High-level domain modules (e.g., x-analytics)
    *   `src/pages/`: Route entry points
    *   `src/store/`: Zustand global state
    *   `src/hooks/`: React hooks
    *   `src/lib/`: External wrappers (e.g., supabase client)
*   `backend/`: Node.js API
    *   `src/routes/`: API endpoint definitions
    *   `src/services/`: Core business logic
    *   `src/middleware/`: Express middleware
*   `docs/`: Project documentation
*   `docs/ai-context/`: AI project memory files
