import { AudienceService, LinkedInAnalyticsService } from '../services';

export const impressionsHistory = LinkedInAnalyticsService.getImpressionsHistory();
export const followerForecast = AudienceService.getFollowerForecast();
export const heatmapData = LinkedInAnalyticsService.getEngagementHeatmap();
