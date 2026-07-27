import { LinkedInAnalyticsService } from './linkedInAnalyticsService';

export class AIInsightsService {
  static getInsights() {
    return LinkedInAnalyticsService.getDataset().aiInsights;
  }

  static getPremiumScores() {
    return LinkedInAnalyticsService.getDataset().premiumScores;
  }
}
