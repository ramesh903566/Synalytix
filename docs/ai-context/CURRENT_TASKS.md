# Synalytix Current Tasks

This document tracks active work, known bugs, and technical debt.

## Active Work

| Priority | Status | Description | Files Involved | Progress |
| :--- | :--- | :--- | :--- | :--- |
| High | Done | Implement AI Context Management | `docs/ai-context/*` | Initial split structure created. |
| High | Done | Cascade OAuth Startup Failure Fix | Backend auth routes | Diagnostic audit performed. |

## Known Bugs

| Severity | Status | Description | Root Cause | Files |
| :--- | :--- | :--- | :--- | :--- |
| High | Fixed | Cascade startup failed | Missing/invalid `ralphLoop.antigravity.oauthToken` | TBD |
| Low | Fixed | Tailwind CSS Theme Warning | Tailwind v4 uses `@theme` vs v3 config | `frontend/src/index.css` |

## Technical Debt

*   Ensure full test coverage for metric normalization logic.
