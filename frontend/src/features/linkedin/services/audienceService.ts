import { LinkedInAnalyticsService } from './linkedInAnalyticsService';

export class AudienceService {
  static getAudienceData() {
    return LinkedInAnalyticsService.getDataset().audienceData;
  }

  static getFollowerStats() {
    return LinkedInAnalyticsService.getDataset().followersData;
  }

  static getFollowerGrowthTimeline() {
    return LinkedInAnalyticsService.getDataset().followerGrowthTimeline;
  }

  static getFollowerForecast() {
    return LinkedInAnalyticsService.getDataset().followerForecast;
  }
}
