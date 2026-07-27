import { buildLinkedInAnalyticsDataset } from './mockLinkedInDataset';

const dataset = buildLinkedInAnalyticsDataset();

export class LinkedInAnalyticsService {
  static getOverviewMetrics() {
    return dataset.overviewMetrics;
  }

  static getImpressionsHistory() {
    return dataset.impressionsHistory;
  }

  static getEngagementHeatmap() {
    return dataset.heatmapData;
  }

  static getDataset() {
    return dataset;
  }
}
