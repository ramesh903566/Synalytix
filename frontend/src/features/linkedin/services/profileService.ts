import { LinkedInAnalyticsService } from './linkedInAnalyticsService';

export class ProfileService {
  static getProfileAnalytics() {
    return LinkedInAnalyticsService.getDataset().profileAnalytics;
  }
}
