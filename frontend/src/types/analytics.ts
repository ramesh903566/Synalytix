export type PlatformType = 'instagram' | 'x' | 'linkedin' | 'github' | 'youtube' | 'leetcode' | 'hackerrank' | 'codeforces' | 'devto' | 'medium' | 'reddit' | 'stackoverflow';

export interface BaseMetrics {
  views: number;
  engagements: number;
  reach?: number;
  followers?: number;
  postsCount?: number;
}

export interface AIInsights {
  healthScore: number; // 0-100
  growthScore: number;
  engagementScore: number;
  reachScore: number;
  consistencyScore: number;
  audienceHealthScore: number;
  
  postingFrequency: string;
  topPerformingContentType: string;
  growthTrend: 'Improving' | 'Stable' | 'Declining' | 'Critical';
  
  recommendations: AIRecommendation[];
  summary: string;
}

export interface AIRecommendation {
  type: 'optimal_time' | 'content_mix' | 'audience_growth' | 'consistency' | 'general';
  title: string;
  description: string;
  impact: string; // e.g., "High", "Medium", "Low" or "+35% reach"
}

// Level 5: Individual Content Analytics
export interface ContentAnalytics {
  id: string;
  platform: PlatformType;
  accountId: string;
  type: string; // 'Reel', 'Post', 'Tweet', 'Commit', etc.
  title: string;
  publishedAt: string;
  url?: string;
  
  metrics: BaseMetrics & {
    likes?: number;
    comments?: number;
    shares?: number;
    saves?: number;
    [key: string]: any; // Platform specific extras
  };
  
  aiInsights?: AIInsights;
}

// Level 4: Individual Account Analytics
export interface AccountAnalytics {
  id: string;
  platform: PlatformType;
  handle: string;
  name: string;
  profileImageUrl?: string;
  
  overview: BaseMetrics;
  growthHistory: { date: string; value: number }[];
  audience?: any; // Platform specific audience breakdown
  
  content: ContentAnalytics[];
  
  aiInsights?: AIInsights;
  lastSynced: string;
}

// Level 3 & 1: Platform Analytics
export interface PlatformAnalyticsData {
  platform: PlatformType;
  accounts: AccountAnalytics[];
  
  // Aggregated totals
  aggregatedMetrics: BaseMetrics;
  
  // Cross-account insights
  aiInsights?: AIInsights & {
    bestPerformingAccount?: string;
    worstPerformingAccount?: string;
    fastestGrowingAccount?: string;
  };
}

// Level 0: Cross Platform Intelligence
export interface CrossPlatformInsights {
  overallHealthScore: number;
  totalViews: number;
  totalEngagements: number;
  totalFollowers: number;
  
  strongestPlatform: PlatformType;
  weakestPlatform: PlatformType;
  
  crossPlatformRecommendations: string[];
  
  platforms: Record<PlatformType, PlatformAnalyticsData | null>;
}
