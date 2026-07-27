import { LinkedInAnalyticsService } from './linkedInAnalyticsService';

export class PostAnalyticsService {
  static getPosts() {
    return LinkedInAnalyticsService.getDataset().posts;
  }
}
