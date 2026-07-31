# Synalytix Backend Completion Audit

Date: 2026-07-31

This document records what must be completed to productionize the existing Synalytix backend without creating a new backend, without breaking the current frontend, and without removing existing features. The frontend is treated as the current product contract, but several frontend contracts still point at mock data or mismatched routes and must be normalized before the backend can be considered complete.

## 1. Current Architecture Map

### 1.1 Runtime Stack

- Frontend: React 19, Vite, TypeScript, React Query, Zustand, Tailwind, Recharts.
- Backend: Express 4, TypeScript, Supabase service-role client, Redis through `ioredis`, `node-cron`.
- Database: Supabase PostgreSQL migrations under `backend/supabase/migrations`.
- Authentication: Supabase Auth JWT expected by backend middleware.
- External providers already represented in code: GitHub, Instagram/Meta, X, LinkedIn, LeetCode, Google Calendar, OpenAI-compatible chat, Anthropic, Gemini, DeepSeek, Grok.

### 1.2 Backend Entry Points

- `backend/src/index.ts`: Express app, security middleware, rate limits, routes, cron startup.
- `backend/src/middleware/auth.ts`: Supabase JWT authentication.
- `backend/src/routes/auth.ts`: OAuth connect/callback/disconnect/status.
- `backend/src/routes/data.ts`: platform data aggregation and Google Calendar events.
- `backend/src/routes/recommendations.ts`: AI recommendation generation and recommendation state changes.
- `backend/src/routes/settings.ts`: AI custom instructions.
- `backend/src/routes/accounts.ts`: normalized connection list for settings/apps.
- `backend/src/routes/studio.ts`: GitHub repo listing, creation, file publish.
- `backend/src/routes/chat.ts`: chat conversations, messages, SSE streaming.
- `backend/src/routes/ai-providers.ts`: per-user AI provider model configuration.
- `backend/src/services/*`: provider clients, connection persistence, token refresh, LeetCode sync.

### 1.3 Frontend API Surfaces

- `frontend/src/lib/api.ts`: main Supabase-token API client for auth status, platform data, recommendations.
- `frontend/src/lib/chat-api.ts`: chat and AI provider calls, currently reads `localStorage.token`.
- `frontend/src/lib/studio/api.ts`: Studio GitHub APIs and mocked draft generation, currently reads `localStorage.token`.
- `frontend/src/hooks/useSettings.ts`: settings hooks, currently reads `localStorage.token`.
- `frontend/src/hooks/useRecommendations.ts`: fully mocked recommendation data, not using backend.
- `frontend/src/features/github/api/githubApi.ts`: calls `/api/github/:username/*`, which does not exist in backend, and falls back to mock data.
- `frontend/src/modules/x-analytics/services/xApiClient.ts`: mock mode only; live mode throws.
- `frontend/src/features/linkedin/services/*`: LinkedIn analytics are built from frontend mock datasets.
- `frontend/src/modules/analytics/utils/instagramAdapter.ts`: Instagram analytics are adapted from frontend mock data.
- `frontend/src/context/AppContext.tsx`: planner, drafts, scheduled posts, auth bypass, and calendar state live mostly in frontend memory.

### 1.4 Database Objects Present

- `platform_connections`: provider connection metadata and encrypted tokens.
- `oauth_states`: OAuth CSRF state and X PKCE verifier.
- `api_cache`: coarse API response cache.
- `user_profiles`: auth profile extension.
- `leetcode_profile_snapshots`: append-only LeetCode snapshots.
- `RecommendationRun`, `Recommendation`, `CareerScore`, `OpportunityAlert`: recommendation persistence.
- `ai_custom_instructions`: user-level AI instructions.
- `user_providers`: BYOK AI provider settings.
- `conversations`, `messages`: AI chat persistence.

## 2. Critical Backend Blockers

These must be fixed before deeper production work.

1. Fix `backend/src/routes/data.ts` token helper recursion.
   - Current helper calls itself: `function getToken(...) { return getToken(conn) as string; }`.
   - Required behavior: return `conn.decrypted_access_token` and reject missing tokens with a clear 401/connection error.
   - Impact: GitHub, Instagram, X, LinkedIn summary and detail routes will fail at runtime.

2. Remove raw encrypted-token usage in `backend/src/routes/studio.ts`.
   - Current Studio route reads `platform_connections.access_token` directly from Supabase.
   - Tokens are encrypted by `ConnectionService.upsert`.
   - Required behavior: use `ConnectionService.getByUserAndPlatform` and pass `decrypted_access_token`.
   - Impact: GitHub repo list/create/publish cannot work against GitHub with encrypted tokens.

3. Standardize frontend token retrieval.
   - Some clients use Supabase session (`frontend/src/lib/api.ts`), while chat/settings/studio use `localStorage.getItem("token")`.
   - Required behavior: one shared API client that always obtains the Supabase session token.
   - Impact: protected backend routes return 401 even after a real Supabase login.

4. Restore production auth in frontend.
   - `frontend/src/App.tsx`, `frontend/src/context/AppContext.tsx`, and `frontend/src/pages/Auth.tsx` bypass auth for review.
   - Required behavior: enforce Supabase auth on protected app routes and handle loading/logout/session changes.
   - Impact: frontend can render private routes while backend denies calls.

5. Align recommendation frontend with backend.
   - `frontend/src/hooks/useRecommendations.ts` returns hardcoded recommendations and no backend calls.
   - Required behavior: call `GET /api/recommendations`, `POST /api/recommendations/generate`, `POST /api/recommendations/:id/complete`, `POST /api/recommendations/:id/dismiss`, and `POST /api/recommendations/alerts/:id/dismiss`.
   - Impact: recommendation UI is not backed by production data.

6. Align GitHub analytics frontend routes with backend.
   - Frontend calls `/api/github/:username/profile`, `/api/github/:username/contributions`, `/api/github/:username/activity`, `/api/github/:username/repositories`, `/api/github/:username/languages`, `/api/github/:username/timeline`.
   - Backend exposes `/api/data/github/profile`, `/api/data/github/contributions`, `/api/data/github/repos`, `/api/data/github/languages`, `/api/data/github/all`.
   - Required behavior: either refactor frontend to backend routes or add compatibility routes with authenticated user semantics.
   - Impact: GitHub dashboard silently falls back to mock data.

7. Encrypt BYOK AI provider keys.
   - `user_providers.api_key` migration says keys are encrypted, but `backend/src/routes/ai-providers.ts` stores `api_key` directly.
   - Required behavior: encrypt on save, decrypt only inside AI execution/test paths.
   - Impact: user API keys are stored in plaintext.

8. Make Redis optional or production-required explicitly.
   - `backend/src/lib/redis.ts` defaults to `redis://localhost:6379`.
   - Recommendation cache/rate limiting and LeetCode service tests assume Redis behavior.
   - Required behavior: either document Redis as required and add health checks, or implement a controlled no-Redis fallback for local/dev.
   - Impact: app can boot but recommendation paths may fail or hang depending on Redis availability.

## 3. Frontend to Backend Feature Gap Matrix

Percentages are implementation-readiness estimates from current code inspection, not test coverage guarantees.

| Feature | Frontend | Backend | Database | API Contract | Overall | Required Completion |
|---|---:|---:|---:|---:|---:|---|
| Supabase auth | 45% | 70% | 80% | 45% | 55% | Remove auth bypass, unify token handling, add auth-state tests. |
| App connection status | 70% | 75% | 75% | 65% | 70% | Include `id`, `last_synced`, capabilities consistently; fix token usage. |
| GitHub analytics | 85% | 55% | 25% | 35% | 50% | Fix route mismatch, remove mock fallback, add missing activity/timeline/repo metrics, persist snapshots. |
| GitHub Studio publish | 75% | 55% | 20% | 70% | 55% | Decrypt token, validate publish payload fully, persist publish jobs/history/drafts. |
| Instagram analytics | 80% | 45% | 15% | 45% | 45% | Replace mock adapters, add analytics endpoints matching UI, snapshots, post/account history. |
| X analytics | 85% | 30% | 10% | 15% | 35% | Build live endpoints for overview/content/audience/video/spaces; gate unavailable demographics by capability. |
| LinkedIn analytics | 90% | 25% | 10% | 20% | 35% | Replace frontend mock services with backend-backed profile/page/content/audience endpoints and approved-scope handling. |
| LeetCode analytics | 75% | 75% | 65% | 70% | 70% | Add richer frontend dashboard mapping, trend endpoints, snapshot analytics, manual sync UX. |
| Recommendations | 85% | 70% | 65% | 25% | 55% | Wire frontend hooks, persist full generated payload or reconstruct it, fix score delta, add Instagram connector. |
| AI chat | 80% | 70% | 80% | 60% | 70% | Unify auth token, encrypt provider keys, add SSE tests, add provider fallback UX. |
| AI provider settings | 75% | 55% | 65% | 55% | 60% | Encrypt keys, validate providers/models/base URLs, mask keys, add key rotation/delete tests. |
| Planner | 80% | 10% | 0% | 10% | 25% | Add planner tables and CRUD APIs, persist tasks/events/status/drag updates. |
| Calendar sync | 55% | 45% | 25% | 45% | 45% | Persist calendar events/sync metadata, handle token refresh, add conflict/update semantics. |
| Scheduled posts/drafts | 80% | 10% | 0% | 10% | 25% | Add drafts, scheduled posts, publish queue, status history, real generation endpoint. |
| Dashboard overview | 80% | 40% | 20% | 45% | 45% | Power KPI cards and charts from normalized summaries instead of `MOCK_POSTS`, `IG_OVERVIEW`, and static app data. |
| Analytics hub | 90% | 15% | 5% | 10% | 30% | Replace cross-platform mock insights with backend aggregation and AI insight persistence. |
| Notifications/activity | 50% | 0% | 0% | 0% | 15% | Add notification/activity schema, API, and generation sources. |

## 4. Mock and Placeholder Removal Checklist

### 4.1 Frontend Mock Sources to Replace

1. `frontend/src/data/mockData.ts`
   - `MOCK_APPS` can remain only as static app catalog metadata if decoupled from user data.
   - Replace `MOCK_ACCOUNTS`, `MOCK_POSTS`, `UNIVERSAL_MOCK_DATA`, `MOCK_CROSS_PLATFORM_INSIGHTS` with backend responses.

2. `frontend/src/features/github/api/mockData.ts`
   - Remove fallback data from `githubApi.ts`.
   - Replace wrong `/api/github/:username/*` route calls.

3. `frontend/src/features/linkedin/services/mockLinkedInDataset.ts`
   - Replace all LinkedIn pages/data files that read `LinkedInAnalyticsService`, `PostAnalyticsService`, `ProfileService`, `AudienceService`, and related static datasets.

4. `frontend/src/modules/x-analytics/mock/xMockData.ts`
   - Replace mock mode as the default data source.
   - Live mode must call backend endpoints and only show unavailable metrics when the backend reports missing provider capability.

5. `frontend/src/modules/analytics/utils/instagramAdapter.ts`
   - Replace static Instagram adapter with live `/api/data/instagram/*` or new analytics endpoints.

6. `frontend/src/hooks/useRecommendations.ts`
   - Replace hardcoded recommendation output and delay helpers with backend calls.

7. `frontend/src/lib/studio/api.ts`
   - Replace `useGenerateDrafts` mock with a backend AI draft generation endpoint.

8. `frontend/src/context/AppContext.tsx`
   - Persist planner tasks, scheduled posts, drafts, and calendar event state through backend APIs.

9. `frontend/src/pages/Dashboard.tsx`, `AppsList.tsx`, `AppDetails.tsx`, `AnalyticsHub.tsx`, analytics pages, Studio components, settings integrations.
   - Remove all user-specific mock data dependencies.
   - Keep only static visual metadata where appropriate.

### 4.2 Backend Placeholder Logic to Replace

1. Recommendation score delta currently returns zero.
   - Compute from prior `CareerScore`.

2. Recommendation fetch reconstructs incomplete payload if Redis cache is missing.
   - Persist or reconstruct weekly plan, monthly roadmap, gaps, and alert metadata from database.

3. LinkedIn post analytics returns zeros for likes/comments/shares/impressions/clicks.
   - Implement approved LinkedIn API sources or explicitly mark unsupported personal analytics.

4. Instagram unavailable insights return zeros silently.
   - Return capability/error metadata so frontend can distinguish zero performance from missing permission.

5. X audience/video/live/spaces are not implemented.
   - Add backend capability checks and provider-tier-aware responses.

6. GitHub contributions are approximated from recent events.
   - Decide whether approximation is acceptable; otherwise add GraphQL contribution calendar support.

7. Google Calendar connection stores generic username.
   - Request profile/email scope or derive email safely if required by UI.

8. Background jobs only refresh tokens and LeetCode.
   - Add real platform sync jobs, snapshot jobs, retry jobs, cleanup jobs, publish jobs.

## 5. API Completion Plan

### 5.1 Contract Standardization

1. Use one API envelope everywhere:
   - Success: `{ success: true, data, message? }`.
   - Failure: `{ success: false, error: string, code? }`.

2. Use one frontend API base variable.
   - Current variables include `VITE_API_BASE`, `VITE_API_URL`, `VITE_BACKEND_URL`, and relative `/api`.
   - Pick one convention and update frontend `.env.example`.

3. Use one auth header provider.
   - All frontend API calls must use Supabase session token from `supabase.auth.getSession()`.

4. Add Zod validation for every mutating backend endpoint:
   - Studio repo create/publish.
   - AI provider save/test.
   - Chat send/update.
   - Planner CRUD.
   - Draft/schedule CRUD.
   - Platform sync triggers.

### 5.2 Existing Routes to Fix

1. `GET /api/data/github/*`
   - Fix decrypted token usage.
   - Add activity/timeline compatibility or frontend refactor.
   - Add pagination metadata for repos/activity/timeline.
   - Return language breakdown in `/all`.

2. `GET /api/data/instagram/*`
   - Return normalized account, audience, content, insight, and capability fields needed by universal analytics pages.
   - Include permission status and missing-scope reasons.

3. `GET /api/data/x/*`
   - Expand beyond profile/tweets into overview KPIs, content posts, audience heatmap/demographics, video, spaces, live metrics.
   - Return capability flags for paid API-only metrics.

4. `GET /api/data/linkedin/*`
   - Separate personal profile from organization/page analytics.
   - Add approved-scope detection.
   - Return unsupported metrics as capability gaps, not fake zeros.

5. `POST /api/data/leetcode/connect`, `/sync`, `/all`
   - Add latest snapshot and trend fields in `/all`.
   - Return contest history, solved trend, difficulty distribution, recent activity, and computed metrics expected by LeetCode dashboard.

6. `GET /api/data/summary`
   - Replace provider-specific raw profile dump with stable dashboard summary DTO.
   - Include connected platforms, KPI totals, trend series, recent content, top opportunities, sync status, and error states.

7. `/api/recommendations`
   - Add typed DTO mapper from database snake/camel case to frontend types.
   - Persist full output, not only recommendations/scores/alerts.
   - Add alert dismissal route to frontend hook.

8. `/api/studio/github/*`
   - Fix token decryption.
   - Add request validation and ownership checks.
   - Store publish attempts and results.

9. `/api/chat/*`
   - Ensure configured provider API keys are decrypted at usage time.
   - Persist assistant message even on partial stream failure with failure metadata.
   - Add route-level rate limiting.

10. `/api/ai/*`
   - Encrypt API keys.
   - Never return full API keys.
   - Support active/default model selection.

### 5.3 New Backend APIs Required

1. Planner
   - `GET /api/planner/tasks`
   - `POST /api/planner/tasks`
   - `PATCH /api/planner/tasks/:id`
   - `DELETE /api/planner/tasks/:id`
   - `POST /api/planner/tasks/reorder` if drag/drop ordering is required.

2. Studio drafts and scheduled posts
   - `GET /api/studio/drafts`
   - `POST /api/studio/drafts`
   - `PATCH /api/studio/drafts/:id`
   - `DELETE /api/studio/drafts/:id`
   - `POST /api/studio/drafts/generate`
   - `GET /api/studio/scheduled-posts`
   - `POST /api/studio/scheduled-posts`
   - `PATCH /api/studio/scheduled-posts/:id`
   - `DELETE /api/studio/scheduled-posts/:id`
   - `POST /api/studio/scheduled-posts/:id/publish`

3. Platform analytics snapshots
   - `POST /api/sync/:platform`
   - `GET /api/sync/:platform/status`
   - `GET /api/analytics/:platform/overview`
   - `GET /api/analytics/:platform/accounts`
   - `GET /api/analytics/:platform/content`
   - `GET /api/analytics/:platform/content/:contentId`
   - `GET /api/analytics/cross-platform`

4. Notifications and activity
   - `GET /api/notifications`
   - `PATCH /api/notifications/:id/read`
   - `GET /api/activity`

5. Webhooks
   - Add provider-specific webhook endpoints only when providers support and approve them.
   - Verify signatures.
   - Queue webhook processing instead of doing heavy work in request handlers.

## 6. Database Completion Plan

### 6.1 Normalize Platform Data

Add database tables for persisted analytics instead of relying on `api_cache`.

1. `platform_accounts`
   - user_id, platform, platform_user_id, username, display_name, avatar_url, account_type, capabilities, connected_at, last_synced_at.

2. `platform_sync_runs`
   - user_id, platform, status, started_at, completed_at, error_code, error_message, source, records_fetched, rate_limit_metadata.

3. `platform_metric_snapshots`
   - user_id, platform, account_id, metric_name, metric_value, period_start, period_end, granularity, source_payload_hash.

4. `platform_content`
   - user_id, platform, account_id, provider_content_id, type, title/text/caption, url, published_at, raw_payload.

5. `platform_content_metrics`
   - content_id, metric_name, metric_value, captured_at, period_start, period_end.

6. `platform_audience_snapshots`
   - user_id, platform, account_id, dimension, value, count, percentage, captured_at.

7. `platform_capabilities`
   - user_id, platform, capability, status, reason, last_checked_at.

### 6.2 Add Product Persistence

1. Planner
   - `planner_tasks`: user_id, title, project_id, category, status, scheduled_date, scheduled_time, priority, color, source, external_event_id, created_at, updated_at.
   - Index `(user_id, scheduled_date)`, `(user_id, status)`.

2. Studio
   - `studio_drafts`: user_id, description, apps, drafts, files, status, created_at, updated_at.
   - `scheduled_posts`: user_id, draft_id, app/platform, account_id, scheduled_at, status, publish_result, created_at, updated_at.
   - `publish_jobs`: user_id, scheduled_post_id, platform, status, attempts, last_error, next_attempt_at.

3. Recommendations
   - Add persisted `weekly_plan`, `monthly_roadmap`, `gaps`, and raw AI output table or JSON columns on `RecommendationRun`.
   - Add previous score lookup indexes if missing.

4. Chat and AI providers
   - Add encrypted key migration/backfill strategy.
   - Add `last_used_at` and `last_tested_at` if provider status is shown.

5. Notifications/activity/audit
   - `notifications`: user_id, type, title, body, entity_type, entity_id, read_at, created_at.
   - `audit_logs`: user_id, action, entity_type, entity_id, metadata, ip_hash, user_agent, created_at.

### 6.3 Database Safety Requirements

1. Every table with `user_id` must reference `auth.users(id)` where possible.
2. Every user-owned table must enable RLS.
3. Backend service role bypasses RLS, so every query must still scope by `req.userId`.
4. Add indexes for every route filter and sort path.
5. Avoid destructive migrations; use additive migrations and backfills.
6. Add migration rollback notes even if Supabase migration runner is one-way.
7. Add seed/test fixtures only for local/test environments, never production.

## 7. Integration Completion Plan

### 7.1 GitHub

1. Fix token decryption in data and Studio routes.
2. Verify OAuth scopes: profile, repo read, repo write only when Studio publish is enabled.
3. Add GraphQL or REST enrichment for:
   - contribution calendar,
   - pull requests,
   - issues,
   - stars/forks,
   - languages,
   - commit activity,
   - repo timeline.
4. Add pagination and rate-limit handling.
5. Persist snapshots and content records.
6. Add manual and scheduled sync.

### 7.2 Instagram

1. Keep Meta OAuth flow, but return detailed capability status for missing professional account/page/scopes.
2. Persist account profile, media, media insights, account insights.
3. Add historical trend collection because Meta APIs do not always return long history after the fact.
4. Add token refresh error recovery and reconnect UX.
5. Add post/media pagination.

### 7.3 X

1. Keep OAuth 2 PKCE and refresh support.
2. Detect API tier/capabilities after connect.
3. Implement backend endpoints for every X analytics page.
4. Persist tweets/content and metrics.
5. Clearly gate unavailable demographics/video/spaces metrics.
6. Handle rate limits and paid-tier metrics without fake values.

### 7.4 LinkedIn

1. Separate personal profile, personal posts, organization pages, and organization analytics.
2. Implement approved-scopes discovery and capability reporting.
3. Use real share/UGC post APIs where available.
4. Use organization follower/share statistics where approved.
5. Replace frontend deterministic mock dataset.
6. Do not represent restricted personal metrics as real API data.

### 7.5 LeetCode

1. Keep username-based connect.
2. Persist snapshots on connect, manual sync, and scheduled sync.
3. Add analytics functions for:
   - solved trend,
   - growth rate,
   - consistency,
   - contest trend,
   - difficulty mix,
   - recent submissions.
4. Add retries/backoff for undocumented GraphQL failures.

### 7.6 Google Calendar

1. Request enough scopes to show email/account identity if required.
2. Store refresh token and refresh access token on expiry.
3. Persist imported events or cache sync runs.
4. Map external events to planner tasks without duplicating every refresh.
5. Add disconnect cleanup semantics.

### 7.7 AI Providers

1. Encrypt user API keys.
2. Implement provider-specific model validation.
3. Add connection-test throttling.
4. Add masked key display and rotation.
5. Ensure chat and recommendations both use the same secure provider resolution path.

## 8. Business Logic to Move/Keep in Backend

Move to backend:

1. Dashboard KPI aggregation.
2. Analytics trend calculation.
3. Cross-platform insight generation.
4. Recommendation generation and state transitions.
5. Planner persistence and scheduling logic.
6. Studio draft generation, scheduling, publishing, and retries.
7. Provider capability detection.
8. Platform sync orchestration.
9. Token refresh and reconnect requirements.
10. Rate-limit and retry policy.

Keep in frontend:

1. Presentation and layout.
2. User interactions and optimistic UI where safe.
3. Local UI state such as open drawers, selected tabs, filters.
4. React Query caching of backend responses.
5. Form state before submission.

## 9. Background Jobs and Queues

Current jobs:

- Hourly token refresh scheduler.
- Six-hour LeetCode snapshot scheduler.

Required jobs:

1. Platform sync jobs for GitHub, Instagram, X, LinkedIn, LeetCode, Google Calendar.
2. Analytics snapshot rollup jobs.
3. Recommendation refresh jobs.
4. Studio publish queue and retry worker.
5. AI draft generation job if requests become long-running.
6. Notification generation jobs.
7. Webhook processing jobs.
8. Cache cleanup and OAuth state cleanup.
9. Failed sync retry with exponential backoff.
10. Rate-limit reset and provider health tracking.

Implementation requirement:

- `node-cron` is acceptable for single-process development, but production should use a real queue/worker pattern if multiple backend instances can run.

## 10. Security Completion Plan

1. Remove frontend auth bypass.
2. Use Supabase JWTs consistently.
3. Scope every service-role database query by authenticated user.
4. Encrypt OAuth tokens and BYOK API keys.
5. Never return raw tokens or API keys.
6. Validate every request body, query param, and route param with Zod.
7. Add per-route rate limits for:
   - OAuth connect/callback,
   - AI generation,
   - chat streaming,
   - manual sync,
   - Studio publish,
   - provider test.
8. Add provider webhook signature verification before processing.
9. Add SSRF protection for custom AI base URLs.
10. Add audit logs for connect/disconnect, provider key changes, publish actions, sync failures.
11. Sanitize provider error messages before returning to frontend.
12. Verify CORS origins per environment.
13. Confirm no secrets are stored in frontend `.env`.
14. Add security tests for cross-user access.

## 11. Performance Completion Plan

1. Replace broad API cache with normalized persisted snapshots where historical charts are needed.
2. Add pagination for repos, tweets, posts, content tables, chat history, notifications.
3. Add indexes matching query filters.
4. Batch external API calls and avoid unbounded loops.
5. Add timeout/retry policies for all external calls.
6. Limit fan-out in `/api/data/summary`.
7. Use stale-while-refresh semantics for dashboard summaries.
8. Add Redis health checks and fallback behavior.
9. Split heavy sync from request/response routes.
10. Track API latency and sync duration.

## 12. Testing Completion Plan

### 12.1 Backend Tests

1. Unit tests for:
   - token encryption/decryption,
   - `ConnectionService`,
   - request validators,
   - analytics calculators,
   - recommendation DTO mappers,
   - capability mappers.

2. Route tests for:
   - auth status,
   - each platform data route,
   - LeetCode connect/sync,
   - recommendations generate/fetch/complete/dismiss,
   - planner CRUD,
   - studio draft/schedule/publish,
   - chat history/send,
   - AI provider save/test/delete.

3. Integration tests for:
   - Supabase-scoped user data isolation,
   - encrypted token read/write,
   - Redis unavailable behavior,
   - OAuth state one-time-use and expiry,
   - sync job idempotency.

4. External API tests:
   - mock provider responses with fixtures,
   - rate limit response handling,
   - token expiry and refresh handling,
   - malformed payload handling.

### 12.2 Frontend Contract Tests

1. Replace mock data usage with MSW/API fixtures.
2. Test protected route behavior with logged-in and logged-out states.
3. Test each analytics page against backend-shaped DTOs.
4. Test recommendation actions call backend and update cache.
5. Test Studio publish success/failure states.
6. Test planner persistence.

### 12.3 End-to-End Tests

1. Login/session flow.
2. Connect/disconnect platform flow with mocked OAuth.
3. Dashboard data loading from backend.
4. Analytics navigation and content detail pages.
5. Generate recommendations and mark complete/dismiss.
6. Create planner task and calendar sync display.
7. Create draft and schedule/publish post.
8. Chat conversation create/send/archive/delete.

## 13. Documentation Completion Plan

1. Update backend README with:
   - required services,
   - environment variables,
   - migration order,
   - local Redis/Supabase setup,
   - production deployment steps.

2. Add API reference for:
   - every existing route,
   - every new route,
   - request/response schemas,
   - auth requirements,
   - error codes.

3. Add database schema documentation:
   - table purpose,
   - ownership/RLS,
   - indexes,
   - retention policy.

4. Add provider setup documentation:
   - OAuth app setup,
   - scopes,
   - known provider limitations,
   - paid-tier requirements.

5. Add operations runbook:
   - sync failure recovery,
   - token refresh failures,
   - provider outage handling,
   - queue retry handling,
   - cache cleanup.

## 14. Recommended Execution Order

### Phase 0: Stabilize Contracts

1. Fix `data.ts` recursive token helper.
2. Fix Studio encrypted-token usage.
3. Restore frontend Supabase auth.
4. Replace all `localStorage.token` reads with shared Supabase-token client.
5. Standardize API base env variables.
6. Add route contract tests for current backend.

### Phase 1: Wire Existing Real APIs

1. Wire recommendations frontend hooks to backend.
2. Wire LeetCode dashboard to existing backend data.
3. Wire connection/settings screens to backend responses.
4. Wire Studio GitHub repo list/create/publish after token fix.
5. Wire dashboard summary to `/api/data/summary` after DTO normalization.

### Phase 2: Replace Analytics Mocks

1. GitHub dashboard.
2. Instagram universal analytics.
3. X analytics module.
4. LinkedIn analytics module.
5. Cross-platform analytics hub.

### Phase 3: Add Missing Product Backends

1. Planner tables and APIs.
2. Studio drafts/scheduled posts/publish jobs.
3. Notifications/activity.
4. Calendar persistence and sync metadata.

### Phase 4: Production Sync and History

1. Add normalized platform analytics tables.
2. Add sync jobs and retry workers.
3. Add snapshot rollups.
4. Add provider capabilities and missing-permission states.
5. Add historical trend APIs.

### Phase 5: Security, Performance, and Observability

1. Encrypt BYOK keys.
2. Add route-level rate limits.
3. Add audit logs.
4. Add structured logging and request IDs.
5. Add health checks for Supabase, Redis, and provider workers.
6. Add metrics for latency, sync failures, cache hit rate.

### Phase 6: Full Validation

1. Backend build.
2. Frontend build.
3. Backend tests.
4. Frontend tests.
5. E2E tests.
6. Manual browser verification of major workflows.
7. Provider sandbox/live verification where credentials are available.

## 15. Acceptance Criteria for Backend Completion

The backend is complete only when all of the following are true:

1. No frontend route depends on user-specific mock analytics, mock recommendations, mock accounts, mock posts, or in-memory planner data.
2. Every protected frontend API call sends a Supabase JWT.
3. Every backend route scopes data to `req.userId`.
4. OAuth tokens and user AI API keys are encrypted at rest.
5. Every frontend feature has a backend endpoint or a documented unsupported-provider capability response.
6. Every chart uses live or persisted backend data.
7. Every platform has connect, disconnect, status, sync, error, and reconnect behavior.
8. Every mutation validates input and returns meaningful errors.
9. Database migrations cover all persisted product state.
10. Background jobs are idempotent and retry safely.
11. Builds pass for frontend and backend.
12. Tests cover auth, API contracts, database scoping, sync jobs, analytics calculators, and error handling.
13. API and setup documentation are current.

## 16. Current Validation Result

Backend TypeScript build was run from `backend/` and passed:

```bash
npm run build
```

Passing build does not mean runtime correctness. The recursive token helper and encrypted-token misuse are runtime blockers that TypeScript did not catch.

## 17. Production Readiness Estimate

- Backend completion: 45%.
- Database completion: 35%.
- Frontend/backend contract completion: 35%.
- Security completion: 50%.
- Testing completion: 25%.
- Overall production readiness: 40%.

The highest-priority path is to fix auth/token plumbing and route contracts first, then remove frontend mocks feature by feature while adding persistence and sync history behind each feature.
