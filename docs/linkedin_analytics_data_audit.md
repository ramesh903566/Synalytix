# LinkedIn Analytics Data Audit

This audit classifies every metric, chart, table column, AI insight, recommendation, score, and widget displayed in the Synalytix LinkedIn Analytics module.

## Source Rules

- Company Page metrics require approved LinkedIn Marketing API access and an authenticated member with the correct organization role.
- Personal profile metrics such as profile views and search appearances are available to the authenticated member in LinkedIn analytics. Public API access for these personal analytics is limited or unavailable, so integrations must use approved access, user-provided export, or a manual connector.
- LinkedIn Premium Business may be required for richer profile/search analytics such as searcher companies, searcher roles, and profile engagement details.
- AI outputs are never treated as native LinkedIn facts. They must show input metrics, processing logic, confidence, output, and suggested action.

## Metric Inventory

| Metric Name | Description | Current Data Source | Can LinkedIn Provide It? | Category | Implementation Status | Recommended Action |
|---|---|---|---|---|---|---|
| Total Impressions | Organic content impressions in the selected period. | `LinkedInAnalyticsService` mock, shaped like share statistics. | Yes for Company Pages via share statistics. | Native | Implemented with typed mock and service. | Connect to `organizationalEntityShareStatistics.totalShareStatistics.impressionCount`. |
| Impressions Growth | Period-over-period impression change. | Derived in `LinkedInAnalyticsService`. | Not directly needed; calculated from LinkedIn periods. | Derived | Implemented. | Formula: `(current - previous) / previous * 100`. |
| Impressions History | Daily impressions chart. | Deterministic service mock. | Yes for Company Pages for rolling API windows. | Native | Implemented. | Use daily `organizationalEntityShareStatistics` intervals. |
| Profile Views | Profile visits. | `ProfileService` mock. | Yes in authenticated member analytics UI; API access is restricted. | Native | Implemented as profile service field. | Connect through approved member analytics source or user-provided export. |
| Profile Views Growth | Period-over-period profile views. | Derived in `ProfileService`. | Calculated from profile view periods. | Derived | Implemented. | Formula: `(current - previous) / previous * 100`. |
| Profile Views Trend | Daily profile view trend chart. | `ProfileService` mock. | Available to authenticated member; Premium may unlock richer engagement analytics. | Native | Implemented. | Connect when approved profile analytics source exists. |
| Search Appearances | Number of times profile appeared in LinkedIn search. | `ProfileService` mock. | Yes in authenticated member LinkedIn Search Appearances. | Native | Implemented. | Connect through approved member analytics source or user-provided export. |
| Search Appearances Growth | Period-over-period search appearance change. | Derived in `ProfileService`. | Calculated from search appearance periods. | Derived | Implemented. | Formula: `(current - previous) / previous * 100`. |
| Search Appearances Trend | Daily search appearance trend. | `ProfileService` mock. | Available to authenticated member where LinkedIn exposes it. | Native | Implemented. | Connect through approved member analytics source or user-provided export. |
| Top Searchers by Company | Companies associated with profile searchers. | `ProfileService` mock. | Available in LinkedIn Search Appearances UI; may require Premium and is not generally public API data. | Native | Implemented with requirement documented. | Keep, but gate behind profile analytics/Premium availability. |
| Top Searchers by Role | Job titles associated with profile searchers. | `ProfileService` mock. | Available in LinkedIn Search Appearances UI; may require Premium and is not generally public API data. | Native | Implemented with requirement documented. | Keep, but gate behind profile analytics/Premium availability. |
| Followers | Total followers. | `AudienceService` mock. | Yes for Company Pages via organization lookup/network size; member follower count may be available to the authenticated user. | Native | Implemented. | Connect to organization follower/network size source. |
| Follower Growth | Period-over-period follower growth. | Derived in `AudienceService`. | Calculated from native follower totals. | Derived | Implemented. | Formula: `(currentFollowers - previousFollowers) / previousFollowers * 100`. |
| New Followers | Followers gained during the period. | `AudienceService` mock. | Yes for Company Pages via follower statistics time intervals. | Native | Implemented. | Connect to `organizationalEntityFollowerStatistics`. |
| Lost Followers | Followers lost during the period. | Derived in `AudienceService`. | Not always exposed as a native count. | Derived | Implemented. | Formula: `newFollowers - netFollowerGrowth` where both components are available. |
| Net Follower Growth | Net followers gained or lost. | Derived in `AudienceService`. | Calculated from follower totals. | Derived | Implemented. | Formula: `currentFollowers - previousFollowers`. |
| Follower Velocity | Average net daily follower growth. | Derived in `AudienceService`. | Calculated from follower timeline. | Derived | Replaced unsupported Returning Visitors card. | Formula: `netFollowerGrowth / numberOfDays`. |
| Returning Visitors | Previously displayed as engaged non-followers. | Removed. | No reliable LinkedIn API source for this dashboard context. | Unsupported | Replaced. | Use Follower Velocity instead. |
| Audience Industries | Follower industry distribution. | `AudienceService` mock. | Yes for Company Pages via follower demographic facets. | Native | Implemented. | Connect to follower statistics industry facet. |
| Audience Companies | Follower company distribution. | `AudienceService` mock. | Yes where LinkedIn exposes company demographic facets. | Native | Implemented. | Connect to follower statistics company facet. |
| Audience Locations | Follower location distribution. | `AudienceService` mock. | Yes for Company Pages via geographic facets. | Native | Implemented. | Connect to follower statistics geo facet. |
| Audience Job Titles | Follower job title distribution. | `AudienceService` mock. | Yes where LinkedIn exposes title/function facets. | Native | Implemented. | Connect to follower statistics function/title facet. |
| Audience Seniority | Follower seniority distribution. | `AudienceService` mock. | Yes via follower demographic facets. | Native | Implemented. | Connect to follower statistics seniority facet. |
| Company Size | Follower company size distribution. | `AudienceService` mock. | Yes via staff-count facet for Company Pages. | Native | Implemented. | Connect to follower statistics staff count facet. |
| Post Title | Post text/title shown in content table and drawer. | `PostAnalyticsService` mock. | Yes for owned posts. | Native | Implemented. | Connect to owned post retrieval endpoint where approved. |
| Post Type | Content format such as image, video, document, poll, newsletter. | `PostAnalyticsService` mock. | Yes from owned post metadata. | Native | Implemented. | Keep as post metadata. |
| Published Date | Post publish timestamp. | `PostAnalyticsService` mock. | Yes from owned post metadata. | Native | Implemented. | Keep as post metadata. |
| Post Impressions | Per-post impressions. | `PostAnalyticsService` mock. | Yes for Company Page shares/UGC posts. | Native | Implemented. | Connect to share statistics per post. |
| Unique Impressions | Unique members who saw a post. | `PostAnalyticsService` mock. | Yes for Company Pages via `uniqueImpressionsCount`. | Native | Replaced ambiguous Reach label. | Use `uniqueImpressionsCount`; label as Unique Impressions. |
| Reach | Previously displayed as synthetic `impressions * 0.8`. | Removed as a primary label. | LinkedIn provides unique impressions, not arbitrary reach. | Unsupported | Replaced. | Use Unique Impressions. |
| Clicks | Click count on organic content. | `PostAnalyticsService` mock. | Yes for Company Page share statistics. | Native | Replaced Followers Generated drawer metric. | Use `clickCount`. |
| Click-Through Rate | Share of impressions that generated clicks. | Derived in `PostAnalyticsService`. | Calculated from native clicks and impressions. | Derived | Implemented. | Formula: `clicks / impressions * 100`. |
| Reactions | Sum and breakdown of reaction types. | `PostAnalyticsService` mock. | Yes via social metadata/reactions for approved scopes. | Native | Implemented. | Connect to `socialMetadata.reactionSummaries`. |
| Comments | Comment count. | `PostAnalyticsService` mock. | Yes via social metadata/comment summary. | Native | Implemented. | Connect to `socialMetadata.commentSummary.count`. |
| Reposts | Repost/share count. | `PostAnalyticsService` mock. | Yes for Company Page share statistics. | Native | Implemented. | Connect to `shareCount`. |
| Sends/Shares | Share/send style count displayed in drawer. | `PostAnalyticsService` mock. | Share count is available; private sends are not generally exposed. | Native | Implemented as share count. | Label future integrations as share count unless sends are explicitly available. |
| Engagement Rate | Engagement normalized by impressions. | Derived in `PostAnalyticsService`. | LinkedIn share statistics may provide engagement for Company Pages; app can calculate it. | Derived | Implemented. | Formula: `(reactions + comments + shares + clicks) / impressions * 100`. |
| AI Post Score | Model score in content table. | `AIInsightsService` model metadata on each post. | No. | AI | Renamed from generic Score. | Keep as AI estimate with confidence and formula notes. |
| Virality Prediction | Probability estimate in post drawer. | AI estimate from engagement and repost velocity. | No. | AI | Explicitly labeled as estimate. | Keep only as AI prediction; do not present as LinkedIn metric. |
| Engagement Heatmap | Engagement grouped by publish day/hour. | Derived from post publish timestamp and engagement counts. | LinkedIn does not expose follower-online heatmap in this context. | Derived | Replaced followers-online claim. | Formula: sum post engagements by `publishedAt` day/hour. |
| Followers Online | Previously implied by heatmap subtitle. | Removed. | Not exposed by LinkedIn API for this module. | Unsupported | Replaced. | Use engagement by publish time instead. |
| Follower Growth Forecast | Seven-day projected follower count. | `AIInsightsService`/forecast mock. | No. | AI | Implemented as forecast. | Show as projection with confidence, not fact. |
| AI Growth Score | Composite score. | `AIInsightsService`. | No. | AI | Explicitly labeled in copy. | Inputs: engagement rate, follower velocity, profile view growth. |
| Audience Quality Score | Persona-fit score. | `AIInsightsService`. | No. | AI | Implemented with inputs/confidence. | Inputs: seniority, industry, job title. |
| Posting Habit Score | Consistency and format mix score. | `AIInsightsService`. | No. | AI | Implemented with inputs/confidence. | Inputs: publish timestamps, content types, engagement by publish time. |
| Top Insights | AI insight cards on Overview. | `AIInsightsService`. | No. | AI | Implemented with supporting metrics and confidence. | Keep AI framing. |
| Actionable Recommendations | AI recommendation cards. | `AIInsightsService`. | No. | AI | Implemented with supporting metrics and confidence. | Every recommendation must include reason and confidence. |

## Unsupported Metrics Removed Or Replaced

| Unsupported Metric | Resolution |
|---|---|
| Followers Online | Replaced with engagement grouped by publish day/hour. |
| Followers Generated | Replaced with native clicks. Exact follower attribution by post is not a generally available LinkedIn metric. |
| Synthetic Reach | Replaced with native unique impressions. |
| Feed Ranking Score / Algorithm Score | Not displayed. Generic score was renamed AI Post Score. |
| Profile Session Duration / Time on Profile | Not displayed. Do not add unless LinkedIn Premium profile engagement explicitly provides it to the authenticated user. |
| Mouse Tracking / Scroll Depth | Not displayed. Not LinkedIn data. |
| Exact Recruiter Searches / Exact Search Keywords | Not displayed. Searcher company/title summaries can be shown where LinkedIn exposes them. |
| Competitor Analytics for Personal Profiles | Not displayed. Not available through legitimate LinkedIn profile analytics access. |

## Derived Formulas

- Engagement Rate = `(reactions + comments + shares + clicks) / impressions * 100`
- Click-Through Rate = `clicks / impressions * 100`
- Impression Growth = `(currentPeriodImpressions - previousPeriodImpressions) / previousPeriodImpressions * 100`
- Profile View Growth = `(currentProfileViews - previousProfileViews) / previousProfileViews * 100`
- Search Appearance Growth = `(currentSearchAppearances - previousSearchAppearances) / previousSearchAppearances * 100`
- Follower Growth Rate = `(currentFollowers - previousFollowers) / previousFollowers * 100`
- Net Follower Growth = `currentFollowers - previousFollowers`
- Lost Followers = `newFollowers - netFollowerGrowth` when both values are available
- Follower Velocity = `netFollowerGrowth / numberOfDays`
- Engagement Heatmap = `sum(reactions + comments + shares + clicks) grouped by published day/hour`

## AI Output Contract

Every AI insight and recommendation now includes:

- Inputs
- Processing logic
- Confidence score
- Output
- Suggested action
- Supporting metrics

AI output must be described with language such as "AI estimate", "projection", "likely", or "recommendation". It must not be displayed as a factual LinkedIn metric.
