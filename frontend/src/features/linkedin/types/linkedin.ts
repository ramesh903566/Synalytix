export type PostType = 'Article' | 'Carousel' | 'Image' | 'Video' | 'Poll' | 'Newsletter' | 'Document';

export type MetricCategory = 'Native' | 'Derived' | 'AI' | 'Unsupported';

export type LinkedInAccessRequirement =
  | 'LinkedIn Marketing API Company Page admin access'
  | 'Authenticated member LinkedIn analytics'
  | 'LinkedIn Premium Business profile analytics'
  | 'Derived from native LinkedIn metrics'
  | 'AI estimate from available LinkedIn metrics'
  | 'Not exposed by LinkedIn';

export interface MetricMetadata {
  category: MetricCategory;
  source: string;
  formula?: string;
  accessRequirement: LinkedInAccessRequirement;
  confidence?: number;
}

export interface LinkedInPost {
  id: string;
  title: string;
  type: PostType;
  publishedAt: string; // ISO date or descriptive
  impressions: number;
  uniqueImpressions: number;
  reach: number;
  ctr: number;
  engagementRate: number;
  comments: number;
  reposts: number;
  shares: number;
  clicks: number;
  totalEngagements: number;
  score: number;
  img?: string | null;
  status: 'Published' | 'Draft' | 'Scheduled';
  // Extra detailed metrics for drawer
  likes: number;
  celebrates: number;
  supports: number;
  loves: number;
  insightful: number;
  funny: number;
  metrics: {
    impressions: MetricMetadata;
    uniqueImpressions: MetricMetadata;
    ctr: MetricMetadata;
    engagementRate: MetricMetadata;
    comments: MetricMetadata;
    reposts: MetricMetadata;
    shares: MetricMetadata;
    clicks: MetricMetadata;
    score: MetricMetadata;
  };
}

export interface LinkedInOverviewMetrics {
  impressions: number;
  impressionsGrowth: number;
  profileViews: number;
  profileViewsGrowth: number;
  searchAppearances: number;
  searchAppearancesGrowth: number;
  followers: number;
  followersGrowth: number;
  engagementRate: number;
  netFollowers: number;
  contentMixLeader: string;
  metrics: {
    impressions: MetricMetadata;
    impressionsGrowth: MetricMetadata;
    profileViews: MetricMetadata;
    profileViewsGrowth: MetricMetadata;
    searchAppearances: MetricMetadata;
    searchAppearancesGrowth: MetricMetadata;
    followers: MetricMetadata;
    followersGrowth: MetricMetadata;
    engagementRate: MetricMetadata;
    netFollowers: MetricMetadata;
  };
}

export interface DataPoint {
  date: string;
  value: number;
  forecast?: number;
}

export interface HeatmapPoint {
  day: number;
  hour: number;
  value: number;
}

export interface DemographicSegment {
  name: string;
  pct: number;
  value?: number;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'insight' | 'action';
  priority?: 'High' | 'Medium' | 'Low';
  impact?: 'High' | 'Medium' | 'Low';
  difficulty?: 'Hard' | 'Medium' | 'Easy';
  estimatedGain?: string;
  inputs: string[];
  processingLogic: string;
  confidence: number;
  output: string;
  suggestedAction: string;
  supportingMetrics: string[];
}

export interface LinkedInAudienceData {
  industries: DemographicSegment[];
  companies: DemographicSegment[];
  locations: DemographicSegment[];
  jobTitles: DemographicSegment[];
  companySize: DemographicSegment[];
  seniority: DemographicSegment[];
  countries: DemographicSegment[];
  cities: DemographicSegment[];
}

export interface LinkedInFollowerStats {
  total: number;
  newFollowers: number;
  lostFollowers: number;
  netGrowth: number;
  followerVelocity: number;
  totalGrowth: number;
  newFollowersGrowth: number;
  lostFollowersTrend: number;
  netGrowthRate: number;
  velocityGrowth: number;
  metrics: {
    total: MetricMetadata;
    newFollowers: MetricMetadata;
    lostFollowers: MetricMetadata;
    netGrowth: MetricMetadata;
    followerVelocity: MetricMetadata;
  };
}

export interface ProfileSearchSegment {
  name: string;
  count: number;
}

export interface LinkedInProfileAnalytics {
  profileViews: number;
  profileViewsGrowth: number;
  searchAppearances: number;
  searchAppearancesGrowth: number;
  profileViewsTrend: DataPoint[];
  searchAppearancesTrend: DataPoint[];
  searcherCompanies: ProfileSearchSegment[];
  searcherRoles: ProfileSearchSegment[];
  metrics: {
    profileViews: MetricMetadata;
    searchAppearances: MetricMetadata;
    profileViewsTrend: MetricMetadata;
    searchAppearancesTrend: MetricMetadata;
    searcherCompanies: MetricMetadata;
    searcherRoles: MetricMetadata;
  };
}

export interface PremiumScore {
  score: number;
  trend: number;
  title: string;
  description: string;
  inputs: string[];
  processingLogic: string;
  confidence: number;
}

export interface PremiumScores {
  aiGrowthScore: PremiumScore;
  audienceQualityScore: PremiumScore;
  postingHabitScore: PremiumScore;
}

export interface LinkedInAnalyticsDataset {
  overviewMetrics: LinkedInOverviewMetrics;
  impressionsHistory: DataPoint[];
  followerGrowthTimeline: DataPoint[];
  followerForecast: DataPoint[];
  heatmapData: HeatmapPoint[][];
  followersData: LinkedInFollowerStats;
  audienceData: LinkedInAudienceData;
  profileAnalytics: LinkedInProfileAnalytics;
  posts: LinkedInPost[];
  aiInsights: AIInsight[];
  premiumScores: PremiumScores;
}

export interface MetricAuditItem {
  metricName: string;
  description: string;
  currentDataSource: string;
  canLinkedInProvideIt: string;
  category: MetricCategory;
  implementationStatus: string;
  recommendedAction: string;
}
