import { UniversalAnalyticsData, ConnectedAccount, KPIMetric, ContentItem } from '../types';
import { IG_OVERVIEW, IG_AUDIENCE, IG_CONTENT_POSTS, MOCK_ACCOUNTS } from '../../../data/mockData';

export const mapInstagramData = (): UniversalAnalyticsData => {
  const accountsData = MOCK_ACCOUNTS['instagram'] || [];
  
  // Base sparkline for mock
  const mockSparkline = IG_OVERVIEW.viewsHistory.map(v => ({ date: v.date, value: v.val }));

  const accounts: ConnectedAccount[] = accountsData.map(acc => ({
    id: acc.id,
    platform: 'instagram',
    username: acc.username,
    avatarUrl: acc.avatarUrl,
    isPremium: acc.type === 'creator',
    followers: IG_AUDIENCE.followers,
    growth: IG_AUDIENCE.followerGrowth,
    reach: IG_OVERVIEW.allContent.accountsReached,
    engagement: IG_OVERVIEW.allContent.interactions,
    performanceScore: 85,
    healthScore: 92,
    status: 'active',
    lastSync: new Date().toISOString()
  }));

  const selectedAccountOverview: KPIMetric[] = [
    {
      id: 'followers',
      label: 'Total Followers',
      currentValue: IG_AUDIENCE.followers,
      trend: IG_AUDIENCE.followerGrowth > 0 ? 'up' : 'down',
      trendPercentage: IG_AUDIENCE.followerGrowth,
      sparklineData: mockSparkline,
      status: 'excellent',
      format: 'compact'
    },
    {
      id: 'reach',
      label: 'Accounts Reached',
      currentValue: IG_OVERVIEW.allContent.accountsReached,
      trend: 'up',
      trendPercentage: 12.4,
      sparklineData: mockSparkline,
      status: 'good',
      format: 'compact'
    },
    {
      id: 'engagement',
      label: 'Total Interactions',
      currentValue: IG_OVERVIEW.allContent.interactions,
      trend: 'up',
      trendPercentage: 5.2,
      sparklineData: mockSparkline,
      status: 'good',
      format: 'compact'
    },
    {
      id: 'profile_visits',
      label: 'Profile Visits',
      currentValue: IG_OVERVIEW.allContent.profileVisits,
      trend: 'neutral',
      trendPercentage: 0.5,
      sparklineData: mockSparkline,
      status: 'warning',
      format: 'compact'
    }
  ];

  const content: ContentItem[] = IG_CONTENT_POSTS.map(c => ({
    id: c.id,
    type: c.emoji ? 'story' : 'reel',
    caption: c.title || c.emoji || 'Instagram Post',
    publishDate: new Date().toISOString(), // Mocks are relative strings like '3w ago', parsing is tricky here so we mock
    reach: c.accountsReached || c.views,
    impressions: c.views,
    likes: c.likes,
    comments: c.comments,
    shares: c.shares,
    saves: c.saves,
    performanceTimeline: mockSparkline,
    aiReview: c.views > 10000 ? 'This post performed exceptionally well due to the strong opening hook.' : undefined,
    recommendations: c.views > 10000 ? ['Replicate this hook structure', 'Post at a similar time next week'] : undefined
  }));

  return {
    platformId: 'instagram',
    platformName: 'Instagram',
    accounts,
    summary: {
      totalConnectedAccounts: accounts.length,
      combinedFollowers: IG_AUDIENCE.followers,
      combinedReach: IG_OVERVIEW.allContent.accountsReached,
      combinedEngagement: IG_OVERVIEW.allContent.interactions,
      combinedImpressions: IG_OVERVIEW.allContent.views,
      combinedProfileVisits: IG_OVERVIEW.allContent.profileVisits,
      combinedWebsiteClicks: IG_OVERVIEW.allContent.bioLinkTaps,
      combinedPosts: IG_CONTENT_POSTS.length,
      averageEngagementRate: 6.8, // Calculated inline for mock
      averageReach: IG_OVERVIEW.allContent.accountsReached,
      averageGrowth: IG_AUDIENCE.followerGrowth,
      averagePostingFrequency: 3.5, // per week
      topPerformingAccount: accounts[0]?.username,
      fastestGrowingAccount: accounts[0]?.username,
      mostConsistentAccount: accounts[0]?.username,
      healthScore: 92
    },
    selectedAccountOverview,
    selectedAccountContent: content
  };
};
