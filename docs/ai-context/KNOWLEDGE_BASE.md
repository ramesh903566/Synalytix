# Synalytix Knowledge Base

This document logs architectural decisions, conventions, and common patterns used in the project.

## Conventions & Patterns

*   **Tailwind CSS**: Using Tailwind v4. Configuration is primarily done in `frontend/src/index.css` using the `@theme` directive, not `tailwind.config.js`.
*   **API Interactions**: Supabase client is used directly from the frontend for most read/write operations, leveraging Row-Level Security (RLS) for authorization.
*   **Routing**: React Router v7 data APIs (loaders, actions) are preferred for routing and initial data fetching if applicable, otherwise React Query for complex async state.

## Decisions Log

| Date | Decision | Reason | Alternatives Considered | Trade-offs |
| :--- | :--- | :--- | :--- | :--- |
| 2026-07-27 | Split AI Context Files | A single `PROJECT_CONTEXT.md` was proposed, but splitting into `docs/ai-context/` directory saves tokens when switching AI models and provides more targeted context. | Monolithic `PROJECT_CONTEXT.md` | Monolithic requires parsing everything. Split requires AI to follow instructions to only read what's necessary. |
| (Past) | Tailwind CSS v4 | Adoption of the latest Tailwind version for simplified configuration via `@theme`. | Tailwind v3 | Requires adapting to new syntaxes and dropping `tailwind.config.js`. |
| (Past) | Supabase as Primary Backend | Rapid development, built-in Auth, PostgreSQL, Realtime, and Edge functions. | Custom Node.js + Postgres | Less boilerplate with Supabase, but tighter vendor lock-in. |
