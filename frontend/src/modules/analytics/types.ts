export type TrendDirection = 'up' | 'down' | 'neutral';
export type MetricStatus = 'excellent' | 'good' | 'warning' | 'critical';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface KPIMetric {
  id: string;
  label: string;
  currentValue: number | string;
  previousValue?: number | string;
  trend: TrendDirection;
  trendPercentage: number;
  sparklineData: { date: string; value: number }[];
  status: MetricStatus;
  aiSummary?: string;
  format?: 'number' | 'percentage' | 'currency' | 'compact';
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  reason: string;
  evidence: string;
  impact: string;
  confidence: number; // 0-100
  priority: PriorityLevel;
  recommendedAction: string;
  category: 'growth' | 'engagement' | 'content' | 'audience' | 'risk';
}

export interface PlatformSummaryMetrics {
  totalConnectedAccounts: number;
  combinedFollowers: number;
  combinedReach: number;
  combinedEngagement: number;
  combinedImpressions: number;
  combinedProfileVisits: number;
  combinedWebsiteClicks: number;
  combinedPosts: number;
  
  averageEngagementRate: number;
  averageReach: number;
  averageGrowth: number;
  averagePostingFrequency: number;
  averageWatchTime?: number;

  topPerformingAccount?: string;
  fastestGrowingAccount?: string;
  mostConsistentAccount?: string;
  weakestAccount?: string;
  healthScore: number;
}

export interface ConnectedAccount {
  id: string;
  platform: string;
  username: string;
  avatarUrl?: string;
  isPremium?: boolean;
  
  followers: number;
  growth: number; // percentage
  reach: number;
  engagement: number;
  performanceScore: number;
  healthScore: number;
  
  status: 'active' | 'disconnected' | 'error' | 'syncing';
  lastSync: string; // ISO date
}

export interface ContentItem {
  id: string;
  type: 'post' | 'reel' | 'story' | 'video' | 'tweet' | 'article';
  thumbnailUrl?: string;
  caption: string;
  publishDate: string;
  
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  profileVisits?: number;
  followersGained?: number;
  
  performanceTimeline: { date: string; value: number }[];
  aiReview?: string;
  recommendations?: string[];
}

// A generic interface for mapping specific platform data into our universal structure
export interface UniversalAnalyticsData {
  platformId: string;
  platformName: string;
  accounts: ConnectedAccount[];
  summary: PlatformSummaryMetrics;
  
  // Data for a specifically selected account
  selectedAccountOverview?: KPIMetric[];
  selectedAccountInsights?: AIInsight[];
  selectedAccountContent?: ContentItem[];
}
