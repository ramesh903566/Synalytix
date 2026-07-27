import { 
  MOCK_KPIS, 
  MOCK_CONTENT, 
  MOCK_VIDEOS, 
  MOCK_LIVE, 
  MOCK_SPACES,
  MOCK_AUDIENCE_DEMOGRAPHICS,
  MOCK_AUDIENCE_HEATMAP
} from '../mock/xMockData';
import { DateRange, KPI, ContentPost, VideoStats, LiveBroadcast, Space } from '../types/xAnalytics';
import { useXAnalyticsStore } from '../store/useXAnalyticsStore';

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class XApiClient {
  
  static isMockMode() {
    return useXAnalyticsStore.getState().dataSourceMode === 'MOCK';
  }

  static async getOverviewKPIs(dateRange: DateRange): Promise<Record<string, KPI>> {
    if (this.isMockMode()) {
      await delay(500);
      return MOCK_KPIS;
    }
    // LIVE MODE: 
    // const response = await fetch(`/api/x/overview?range=${dateRange}`);
    // return response.json();
    throw new Error("Live mode API not implemented yet. Switch to Mock mode.");
  }

  static async getAudienceDemographics(dateRange: DateRange) {
    if (this.isMockMode()) {
      await delay(600);
      return MOCK_AUDIENCE_DEMOGRAPHICS;
    }
    // LIVE MODE: X API does not provide demographic data directly via organic endpoints.
    // Must be implemented via Ads API or AI estimation backend.
    throw new Error("Audience Demographics API not available natively.");
  }

  static async getAudienceActivityHeatmap(dateRange: DateRange) {
    if (this.isMockMode()) {
      await delay(400);
      return MOCK_AUDIENCE_HEATMAP;
    }
    // LIVE MODE
    throw new Error("Live mode API not implemented yet. Switch to Mock mode.");
  }

  static async getContentPosts(dateRange: DateRange, page = 1): Promise<ContentPost[]> {
    if (this.isMockMode()) {
      await delay(700);
      return MOCK_CONTENT; // Ideally slice by page
    }
    // LIVE MODE
    throw new Error("Live mode API not implemented yet. Switch to Mock mode.");
  }

  static async getVideoStats(dateRange: DateRange): Promise<VideoStats[]> {
    if (this.isMockMode()) {
      await delay(500);
      return MOCK_VIDEOS;
    }
    throw new Error("Live mode API not implemented yet. Switch to Mock mode.");
  }

  static async getLiveBroadcasts(dateRange: DateRange): Promise<LiveBroadcast[]> {
    if (this.isMockMode()) {
      await delay(400);
      return MOCK_LIVE;
    }
    throw new Error("Live mode API not implemented yet. Switch to Mock mode.");
  }

  static async getSpaces(dateRange: DateRange): Promise<Space[]> {
    if (this.isMockMode()) {
      await delay(600);
      return MOCK_SPACES;
    }
    throw new Error("Live mode API not implemented yet. Switch to Mock mode.");
  }
}
