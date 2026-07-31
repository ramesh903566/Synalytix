# Synalytix API Reference

This document outlines the API endpoints and integration details for Synalytix.

## Overview

Synalytix relies heavily on Supabase for direct database access from the client via RLS. A separate Node.js backend (`backend/src/routes/`) handles specialized tasks like OAuth token exchanges and background polling.

## Supabase Edge Functions

*   `generate-variants`: Accepts base text and generates 5 platform-specific content variants using Claude API.
*   `broadcast-dispatcher`: Polls the `broadcast_queue` and sends posts to respective platform APIs.
*   `webhook-receiver`: Receives real-time events from platforms (e.g., GitHub, X).
*   `metric-rollup`: Scheduled job (pg_cron) to aggregate `activity_logs` into `metrics_timeseries`.
*   `ai-insight-generator`: Scheduled job to analyze context and generate daily/weekly briefings.

## External API Integrations

*   **Instagram Graph API**: Ingests follower growth, post performance, story stats.
*   **X API v2**: Ingests follower velocity, tweet impressions, thread performance.
*   **LinkedIn REST API**: Ingests connection counts, post impressions, engagement rates.
*   **GitHub GraphQL API**: Ingests repo metrics, commit frequency, PR lifecycles.
*   **LeetCode GraphQL API**: Ingests problems solved, acceptance rates, contest history.
*   **Anthropic Claude API**: Used for content variant generation and AI insight briefings.

## Backend Routes

*(To be populated as the Node.js backend expands)*
*   OAuth authorization routes
*   Webhook ingress endpoints
