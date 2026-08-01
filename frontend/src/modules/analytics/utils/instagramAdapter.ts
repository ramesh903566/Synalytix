import { UniversalAnalyticsData, ConnectedAccount, KPIMetric, ContentItem } from '../types';

interface InstagramApiData {
  profile?: { username?: string; followers_count?: number; media_count?: number; name?: string };
  insights?: { data?: Array<{ name: string; period: string; values: Array<{ value: number }>; title: string }> };
  media?: { data?: Array<{ id: string; caption?: string; media_type: string; timestamp: string; like_count?: number; comments_count?: number; permalink?: string }> };
}

export const mapInstagramData = (apiData?: InstagramApiData | null): UniversalAnalyticsData => {
  const profile = apiData?.profile;
  const insights = apiData?.insights;
  const media = apiData?.media;

  const followers = profile?.followers_count ?? 0;
  const mediaCount = profile?.media_count ?? 0;

  const getInsightValue = (name: string): number =>
    insights?.data?.find((d) => d.name === name)?.values?.[0]?.value ?? 0;

  const igViews = getInsightValue('impressions');
  const igReach = getInsightValue('reach');
  const igEngagement = getInsightValue('engagement');
  const igProfileVisits = getInsightValue('profile_visits');
  const accountUsername = profile?.username || 'unknown';

  const accounts: ConnectedAccount[] = [{
    id: 'ig_1',
    platform: 'instagram',
    username: accountUsername,
    avatarUrl: undefined,
    isPremium: true,
    followers,
    growth: 0,
    reach: igReach,
    engagement: igEngagement,
    performanceScore: 85,
    healthScore: 92,
    status: 'active',
    lastSync: new Date().toISOString()
  }];

  const sparklineData = insights?.data?.find((d) => d.name === 'impressions')?.values?.map((v, i) => ({
    date: `Day ${i + 1}`,
    value: v.value,
  })) || [];

  const selectedAccountOverview: KPIMetric[] = [
    {
      id: 'followers',
      label: 'Total Followers',
      currentValue: followers,
      trend: 'neutral',
      trendPercentage: 0,
      sparklineData,
      status: 'excellent',
      format: 'compact'
    },
    {
      id: 'reach',
      label: 'Accounts Reached',
      currentValue: igReach,
      trend: 'neutral',
      trendPercentage: 0,
      sparklineData,
      status: 'good',
      format: 'compact'
    },
    {
      id: 'engagement',
      label: 'Total Interactions',
      currentValue: igEngagement,
      trend: 'neutral',
      trendPercentage: 0,
      sparklineData,
      status: 'good',
      format: 'compact'
    },
    {
      id: 'profile_visits',
      label: 'Profile Visits',
      currentValue: igProfileVisits,
      trend: 'neutral',
      trendPercentage: 0,
      sparklineData,
      status: 'warning',
      format: 'compact'
    }
  ];

  const contentItems: ContentItem[] = media?.data?.length
    ? media.data.map((item) => ({
        id: item.id,
        type: (item.media_type === 'VIDEO' ? 'reel' : item.media_type === 'STORY' ? 'story' : 'post') as ContentItem['type'],
        caption: item.caption?.slice(0, 100) || 'Instagram Post',
        publishDate: item.timestamp,
        reach: 0,
        impressions: 0,
        likes: item.like_count ?? 0,
        comments: item.comments_count ?? 0,
        shares: 0,
        saves: 0,
        performanceTimeline: sparklineData,
      }))
    : [];

  return {
    platformId: 'instagram',
    platformName: 'Instagram',
    accounts,
    summary: {
      totalConnectedAccounts: accounts.length,
      combinedFollowers: followers,
      combinedReach: igReach,
      combinedEngagement: igEngagement,
      combinedImpressions: igViews,
      combinedProfileVisits: igProfileVisits,
      combinedWebsiteClicks: 0,
      combinedPosts: mediaCount,
      averageEngagementRate: 0,
      averageReach: igReach,
      averageGrowth: 0,
      averagePostingFrequency: 0,
      topPerformingAccount: accountUsername,
      fastestGrowingAccount: accountUsername,
      mostConsistentAccount: accountUsername,
      healthScore: 92
    },
    selectedAccountOverview,
    selectedAccountContent: contentItems
  };
};
