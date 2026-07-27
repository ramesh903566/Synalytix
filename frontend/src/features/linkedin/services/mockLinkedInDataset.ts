import {
  AIInsight,
  DataPoint,
  HeatmapPoint,
  LinkedInAnalyticsDataset,
  LinkedInAudienceData,
  LinkedInFollowerStats,
  LinkedInOverviewMetrics,
  LinkedInPost,
  MetricMetadata,
  PremiumScores,
  ProfileSearchSegment,
  PostType,
} from '../types/linkedin';

const companyPageNative = (source: string): MetricMetadata => ({
  category: 'Native',
  source,
  accessRequirement: 'LinkedIn Marketing API Company Page admin access',
});

const memberNative = (source: string): MetricMetadata => ({
  category: 'Native',
  source,
  accessRequirement: 'Authenticated member LinkedIn analytics',
});

const premiumNative = (source: string): MetricMetadata => ({
  category: 'Native',
  source,
  accessRequirement: 'LinkedIn Premium Business profile analytics',
});

const derived = (source: string, formula: string): MetricMetadata => ({
  category: 'Derived',
  source,
  formula,
  accessRequirement: 'Derived from native LinkedIn metrics',
});

const aiMetric = (source: string, confidence: number): MetricMetadata => ({
  category: 'AI',
  source,
  confidence,
  accessRequirement: 'AI estimate from available LinkedIn metrics',
});

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const round = (value: number, decimals = 1) => Number(value.toFixed(decimals));

const pctChange = (current: number, previous: number) => {
  if (previous <= 0) return 0;
  return round(((current - previous) / previous) * 100);
};

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

const formatDay = (date: Date) =>
  date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

const toIsoAtHour = (daysAgo: number, hour: number) => {
  const date = new Date('2026-07-25T00:00:00.000Z');
  date.setUTCDate(date.getUTCDate() - daysAgo);
  date.setUTCHours(hour, daysAgo % 4 === 0 ? 30 : 0, 0, 0);
  return date.toISOString();
};

const postTypes: PostType[] = [
  'Document',
  'Image',
  'Video',
  'Article',
  'Carousel',
  'Image',
  'Poll',
  'Newsletter',
];

const topicByType: Record<PostType, string> = {
  Article: 'operating model lessons for analytics teams',
  Carousel: 'a visual teardown of profile optimization',
  Image: 'a concise framework for content planning',
  Video: 'a walkthrough of audience reporting',
  Poll: 'community feedback on reporting priorities',
  Newsletter: 'monthly analytics strategy notes',
  Document: 'a downloadable analytics checklist',
};

const buildPosts = (): LinkedInPost[] =>
  Array.from({ length: 36 }).map((_, index) => {
    const type = postTypes[index % postTypes.length];
    const seasonality = 1 + Math.sin(index / 4) * 0.12;
    const formatLift = type === 'Document' || type === 'Carousel' ? 1.28 : type === 'Video' ? 1.12 : type === 'Poll' ? 0.86 : 1;
    const recencyLift = 1 + (36 - index) * 0.006;
    const impressions = Math.round((9200 + (index % 9) * 850 + index * 190) * seasonality * formatLift * recencyLift);
    const uniqueImpressions = Math.round(impressions * clamp(0.72 + (index % 5) * 0.025, 0.68, 0.86));
    const clicks = Math.round(impressions * (0.011 + (type === 'Document' ? 0.012 : 0) + (type === 'Newsletter' ? 0.009 : 0) + (index % 4) * 0.0015));
    const likes = Math.round(impressions * (0.018 + (index % 5) * 0.0015));
    const celebrates = Math.round(likes * (0.08 + (index % 3) * 0.015));
    const supports = Math.round(likes * (0.05 + (index % 2) * 0.01));
    const loves = Math.round(likes * (0.09 + (type === 'Video' ? 0.03 : 0)));
    const insightful = Math.round(likes * (0.12 + (type === 'Article' ? 0.05 : 0)));
    const funny = Math.round(likes * (type === 'Poll' ? 0.07 : 0.025));
    const reactions = likes + celebrates + supports + loves + insightful + funny;
    const comments = Math.round(impressions * (0.0028 + (type === 'Poll' ? 0.004 : 0) + (index % 3) * 0.0006));
    const reposts = Math.round(impressions * (0.0018 + (type === 'Document' ? 0.0014 : 0)));
    const shares = Math.round(impressions * (0.0014 + (type === 'Carousel' ? 0.0012 : 0)));
    const totalEngagements = reactions + comments + reposts + shares + clicks;
    const engagementRate = round((totalEngagements / impressions) * 100);
    const ctr = round((clicks / impressions) * 100);
    const score = Math.round(
      clamp(engagementRate * 9 + ctr * 4 + (reposts / impressions) * 1200 + (comments / impressions) * 900, 1, 99),
    );

    return {
      id: `linkedin-post-${index + 1}`,
      title: `${type} post ${index + 1}: ${topicByType[type]}.`,
      type,
      publishedAt: toIsoAtHour(index, [9, 11, 14, 16, 18, 8][index % 6]),
      impressions,
      uniqueImpressions,
      reach: uniqueImpressions,
      ctr,
      engagementRate,
      comments,
      reposts,
      shares,
      clicks,
      totalEngagements,
      score,
      status: 'Published',
      likes,
      celebrates,
      supports,
      loves,
      insightful,
      funny,
      img:
        type === 'Poll'
          ? null
          : 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=100&q=80',
      metrics: {
        impressions: companyPageNative('organizationalEntityShareStatistics.totalShareStatistics.impressionCount'),
        uniqueImpressions: companyPageNative('organizationalEntityShareStatistics.totalShareStatistics.uniqueImpressionsCount'),
        ctr: derived('PostAnalyticsService', 'clickCount / impressionCount * 100'),
        engagementRate: derived(
          'PostAnalyticsService',
          '(reactionCount + commentCount + shareCount + clickCount) / impressionCount * 100',
        ),
        comments: companyPageNative('socialMetadata.commentSummary.count'),
        reposts: companyPageNative('organizationalEntityShareStatistics.totalShareStatistics.shareCount'),
        shares: companyPageNative('organizationalEntityShareStatistics.totalShareStatistics.shareCount'),
        clicks: companyPageNative('organizationalEntityShareStatistics.totalShareStatistics.clickCount'),
        score: aiMetric('AIInsightsService post performance model', 86),
      },
    };
  });

const buildImpressionsHistory = (posts: LinkedInPost[]): DataPoint[] => {
  const sortedPosts = [...posts].reverse();
  return Array.from({ length: 30 }).map((_, index) => {
    const date = new Date('2026-06-26T00:00:00.000Z');
    date.setUTCDate(date.getUTCDate() + index);
    const matchingPost = sortedPosts[index % sortedPosts.length];
    const weekdayLift = [0.82, 1.08, 1.18, 1.1, 1.02, 0.88, 0.76][date.getUTCDay()];
    return {
      date: formatDay(date),
      value: Math.round(matchingPost.impressions * weekdayLift),
    };
  });
};

const buildFollowerTimeline = (): DataPoint[] =>
  Array.from({ length: 30 }).map((_, index) => {
    const date = new Date('2026-06-26T00:00:00.000Z');
    date.setUTCDate(date.getUTCDate() + index);
    const weeklyPattern = [8, 14, 18, 16, 12, 6, 5][date.getUTCDay()];
    const campaignLift = index > 18 ? 9 : index > 10 ? 4 : 0;
    return {
      date: formatDay(date),
      value: 12108 + index * 12 + weeklyPattern + campaignLift,
    };
  });

const buildFollowerForecast = (timeline: DataPoint[]): DataPoint[] => {
  const last = timeline[timeline.length - 1].value;
  const sevenDayGain = last - timeline[timeline.length - 8].value;
  const dailyVelocity = Math.max(1, Math.round(sevenDayGain / 7));

  return [
    { date: 'Today', value: last, forecast: last },
    { date: '+1 Day', value: 0, forecast: last + dailyVelocity },
    { date: '+3 Days', value: 0, forecast: last + dailyVelocity * 3 },
    { date: '+5 Days', value: 0, forecast: last + dailyVelocity * 5 },
    { date: '+7 Days', value: 0, forecast: last + dailyVelocity * 7 },
  ];
};

const buildHeatmap = (posts: LinkedInPost[]): HeatmapPoint[][] => {
  const heatmap = Array.from({ length: 7 }).map((_, day) =>
    Array.from({ length: 24 }).map((__, hour) => ({ day, hour, value: 0 })),
  );

  posts.forEach((post) => {
    const publishedAt = new Date(post.publishedAt);
    const day = publishedAt.getUTCDay();
    const hour = publishedAt.getUTCHours();
    heatmap[day][hour].value += post.totalEngagements;
  });

  return heatmap;
};

const audienceData: LinkedInAudienceData = {
  industries: [
    { name: 'Software Development', pct: 34 },
    { name: 'IT Services', pct: 19 },
    { name: 'Financial Services', pct: 14 },
    { name: 'Marketing', pct: 11 },
    { name: 'Higher Education', pct: 8 },
    { name: 'Other', pct: 14 },
  ],
  jobTitles: [
    { name: 'Software Engineer', pct: 24 },
    { name: 'Product Manager', pct: 16 },
    { name: 'Founder', pct: 11 },
    { name: 'Data Scientist', pct: 10 },
    { name: 'Designer', pct: 8 },
    { name: 'Other', pct: 31 },
  ],
  locations: [
    { name: 'San Francisco Bay Area', pct: 21 },
    { name: 'Bengaluru, India', pct: 18 },
    { name: 'New York, NY', pct: 15 },
    { name: 'London, UK', pct: 10 },
    { name: 'Toronto, Canada', pct: 8 },
    { name: 'Other', pct: 28 },
  ],
  companySize: [
    { name: '1-10', pct: 14 },
    { name: '11-50', pct: 19 },
    { name: '51-200', pct: 26 },
    { name: '201-1000', pct: 16 },
    { name: '1001-5000', pct: 11 },
    { name: '5001+', pct: 14 },
  ],
  seniority: [
    { name: 'Senior', pct: 33 },
    { name: 'Entry', pct: 19 },
    { name: 'Manager', pct: 16 },
    { name: 'Director', pct: 12 },
    { name: 'VP', pct: 9 },
    { name: 'CXO', pct: 11 },
  ],
  companies: [
    { name: 'Google', pct: 11 },
    { name: 'Microsoft', pct: 10 },
    { name: 'Amazon', pct: 8 },
    { name: 'Meta', pct: 7 },
    { name: 'Accenture', pct: 5 },
    { name: 'Other', pct: 59 },
  ],
  countries: [
    { name: 'United States', pct: 44 },
    { name: 'India', pct: 21 },
    { name: 'United Kingdom', pct: 15 },
    { name: 'Canada', pct: 10 },
    { name: 'Australia', pct: 5 },
    { name: 'Other', pct: 5 },
  ],
  cities: [
    { name: 'San Francisco', pct: 15 },
    { name: 'New York', pct: 12 },
    { name: 'London', pct: 10 },
    { name: 'Bengaluru', pct: 9 },
    { name: 'Toronto', pct: 5 },
    { name: 'Other', pct: 49 },
  ],
};

const searcherCompanies: ProfileSearchSegment[] = [
  { name: 'Google', count: 92 },
  { name: 'Microsoft', count: 78 },
  { name: 'Amazon', count: 64 },
  { name: 'Meta', count: 51 },
  { name: 'Accenture', count: 37 },
];

const searcherRoles: ProfileSearchSegment[] = [
  { name: 'Recruiter', count: 106 },
  { name: 'Software Engineer', count: 84 },
  { name: 'Product Manager', count: 67 },
  { name: 'Founder', count: 49 },
  { name: 'Investor', count: 31 },
];

const buildOverview = (posts: LinkedInPost[], impressionsHistory: DataPoint[], followerTimeline: DataPoint[]): LinkedInOverviewMetrics => {
  const last30Impressions = sum(impressionsHistory.map((point) => point.value));
  const previous30Impressions = Math.round(last30Impressions / 1.168);
  const totalEngagements = sum(posts.map((post) => post.totalEngagements));
  const totalImpressions = sum(posts.map((post) => post.impressions));
  const followers = followerTimeline[followerTimeline.length - 1].value;
  const previousFollowers = followerTimeline[0].value;

  return {
    impressions: last30Impressions,
    impressionsGrowth: pctChange(last30Impressions, previous30Impressions),
    profileViews: 3840,
    profileViewsGrowth: 12.1,
    searchAppearances: 912,
    searchAppearancesGrowth: -2.4,
    followers,
    followersGrowth: pctChange(followers, previousFollowers),
    engagementRate: round((totalEngagements / totalImpressions) * 100),
    netFollowers: followers - previousFollowers,
    contentMixLeader: 'Document posts drove 34% of impressions',
    metrics: {
      impressions: companyPageNative('organizationalEntityShareStatistics.totalShareStatistics.impressionCount'),
      impressionsGrowth: derived('LinkedInAnalyticsService', '(currentPeriodImpressions - previousPeriodImpressions) / previousPeriodImpressions * 100'),
      profileViews: memberNative('LinkedIn profile analytics visible to the authenticated member'),
      profileViewsGrowth: derived('ProfileService', '(currentProfileViews - previousProfileViews) / previousProfileViews * 100'),
      searchAppearances: memberNative('LinkedIn Search Appearances visible to the authenticated member'),
      searchAppearancesGrowth: derived('ProfileService', '(currentSearchAppearances - previousSearchAppearances) / previousSearchAppearances * 100'),
      followers: companyPageNative('Organization networkSizes/follower count or authenticated member follower count'),
      followersGrowth: derived('AudienceService', '(currentFollowers - previousFollowers) / previousFollowers * 100'),
      engagementRate: derived('PostAnalyticsService', '(reactions + comments + shares + clicks) / impressions * 100'),
      netFollowers: derived('AudienceService', 'newFollowers - lostFollowers'),
    },
  };
};

const buildFollowerStats = (timeline: DataPoint[]): LinkedInFollowerStats => {
  const total = timeline[timeline.length - 1].value;
  const start = timeline[0].value;
  const netGrowth = total - start;
  const newFollowers = 402;
  const lostFollowers = newFollowers - netGrowth;
  const followerVelocity = round(netGrowth / 30);

  return {
    total,
    newFollowers,
    lostFollowers,
    netGrowth,
    followerVelocity,
    totalGrowth: pctChange(total, start),
    newFollowersGrowth: 11.8,
    lostFollowersTrend: -4.6,
    netGrowthRate: 14.7,
    velocityGrowth: 8.9,
    metrics: {
      total: companyPageNative('Organization networkSizes/follower count or authenticated member follower count'),
      newFollowers: companyPageNative('organizationalEntityFollowerStatistics time-bound organicFollowerCount'),
      lostFollowers: derived('AudienceService', 'newFollowers - netFollowerGrowth when both values are available'),
      netGrowth: derived('AudienceService', 'currentFollowers - previousFollowers'),
      followerVelocity: derived('AudienceService', 'netFollowerGrowth / numberOfDays'),
    },
  };
};

const buildProfileAnalytics = (impressionsHistory: DataPoint[]) => ({
  profileViews: 3840,
  profileViewsGrowth: 12.1,
  searchAppearances: 912,
  searchAppearancesGrowth: -2.4,
  profileViewsTrend: impressionsHistory.map((point, index) => ({
    date: point.date,
    value: Math.round(94 + index * 2.8 + (index % 5) * 7),
  })),
  searchAppearancesTrend: impressionsHistory.map((point, index) => ({
    date: point.date,
    value: Math.round(22 + index * 0.8 + (index % 4) * 4),
  })),
  searcherCompanies,
  searcherRoles,
  metrics: {
    profileViews: memberNative('LinkedIn profile analytics visible to the authenticated member'),
    searchAppearances: memberNative('LinkedIn Search Appearances visible to the authenticated member'),
    profileViewsTrend: derived('ProfileService', 'daily profile view counts from authenticated member profile analytics'),
    searchAppearancesTrend: derived('ProfileService', 'daily search appearance counts from authenticated member search analytics'),
    searcherCompanies: premiumNative('LinkedIn Search Appearances top companies'),
    searcherRoles: premiumNative('LinkedIn Search Appearances top job titles'),
  },
});

const buildAiInsights = (posts: LinkedInPost[], overview: LinkedInOverviewMetrics): AIInsight[] => {
  const documentPosts = posts.filter((post) => post.type === 'Document' || post.type === 'Carousel');
  const imagePosts = posts.filter((post) => post.type === 'Image');
  const avgDocumentEngagement = round(sum(documentPosts.map((post) => post.engagementRate)) / documentPosts.length);
  const avgImageEngagement = round(sum(imagePosts.map((post) => post.engagementRate)) / imagePosts.length);
  const bestMorningPosts = posts.filter((post) => {
    const hour = new Date(post.publishedAt).getUTCHours();
    return hour >= 8 && hour <= 11;
  });
  const morningCtr = round(sum(bestMorningPosts.map((post) => post.ctr)) / bestMorningPosts.length);

  return [
    {
      id: 'ai1',
      title: 'Engagement Lift Detected',
      description: `AI estimate: engagement is ${round(avgDocumentEngagement - avgImageEngagement)} points higher on document-style posts than image posts in the last 30 days.`,
      type: 'positive',
      impact: 'High',
      difficulty: 'Easy',
      estimatedGain: '+4-6% engagement',
      inputs: ['Post impressions', 'Reactions', 'Comments', 'Shares', 'Clicks', 'Content type'],
      processingLogic: 'Compares average engagement rate by content type and checks that sample counts are sufficient.',
      confidence: 88,
      output: 'Document-style content is outperforming static image content.',
      suggestedAction: 'Keep at least one document or carousel post in the next weekly content cycle.',
      supportingMetrics: [`Document/carousel avg engagement ${avgDocumentEngagement}%`, `Image avg engagement ${avgImageEngagement}%`],
    },
    {
      id: 'ai2',
      title: 'Format Optimization',
      description: `Document posts averaged ${avgDocumentEngagement}% engagement versus ${avgImageEngagement}% for image posts over the last 30 days.`,
      type: 'insight',
      priority: 'High',
      inputs: ['Content type', 'Engagement rate'],
      processingLogic: 'Ranks content formats by engagement rate and impression-weighted sample size.',
      confidence: 91,
      output: 'Documents and carousels are the strongest recent formats.',
      suggestedAction: 'Convert high-performing text posts into document-style posts where the topic supports it.',
      supportingMetrics: [`${documentPosts.length} document/carousel posts`, `${imagePosts.length} image posts`],
    },
    {
      id: 'ai3',
      title: 'Timing Optimization',
      description: `AI estimate: posts published between 8 AM and 11 AM averaged ${morningCtr}% CTR, the strongest observed window in this dataset.`,
      type: 'action',
      priority: 'Medium',
      impact: 'Medium',
      estimatedGain: '+8-12% clicks',
      inputs: ['Published time', 'Clicks', 'Impressions'],
      processingLogic: 'Groups posts by publish hour and compares click-through rate by window.',
      confidence: 82,
      output: 'Morning publishing is likely to improve clicks for this audience.',
      suggestedAction: 'Schedule the next high-intent post in the 8 AM to 11 AM window.',
      supportingMetrics: [`Morning CTR ${morningCtr}%`, 'CTR = clicks / impressions'],
    },
    {
      id: 'ai4',
      title: 'Search Visibility Shift',
      description: `AI estimate: search appearances are ${overview.searchAppearancesGrowth}% versus last month while profile views are up ${overview.profileViewsGrowth}%.`,
      type: 'insight',
      inputs: ['Search appearances', 'Profile views'],
      processingLogic: 'Compares search appearance trend against profile view trend to identify visibility mismatches.',
      confidence: 76,
      output: 'Profile engagement is improving faster than search discovery.',
      suggestedAction: 'Refresh headline keywords and featured content to improve search conversion.',
      supportingMetrics: [`Search appearances ${overview.searchAppearancesGrowth}%`, `Profile views ${overview.profileViewsGrowth}%`],
    },
    {
      id: 'ai5',
      title: 'Topic Opportunity',
      description: 'AI estimate: analytics operations topics are outperforming broad AI commentary based on recent engagement and repost rates.',
      type: 'insight',
      inputs: ['Post title', 'Content type', 'Engagement rate', 'Reposts'],
      processingLogic: 'Clusters post titles into topics and compares engagement and repost rates by topic cluster.',
      confidence: 74,
      output: 'Operational analytics content is a stronger topic cluster.',
      suggestedAction: 'Publish one more operational analytics example before expanding into adjacent topics.',
      supportingMetrics: ['Topic cluster engagement rank: #1', 'Repost rate above 30-day median'],
    },
    {
      id: 'ai6',
      title: 'Video Efficiency Watch',
      description: 'AI estimate: video posts are receiving healthy views but lower click-through than document posts.',
      type: 'negative',
      difficulty: 'Medium',
      estimatedGain: '+6-10% clicks',
      inputs: ['Video impressions', 'Video clicks', 'Document clicks'],
      processingLogic: 'Compares video CTR against document CTR; no claim is made about viewer retention without video watch-time data.',
      confidence: 79,
      output: 'Video should be optimized for clearer click intent.',
      suggestedAction: 'Move the call to action into the first third of the video caption and opening frame.',
      supportingMetrics: ['Video CTR below document CTR', 'Watch-time retention requires LinkedIn videoAnalytics access'],
    },
    {
      id: 'ai7',
      title: 'Growth Forecast',
      description: 'AI estimate: follower growth should remain positive next week if posting frequency stays near the current cadence.',
      type: 'action',
      impact: 'Low',
      inputs: ['Follower timeline', 'Posting frequency', 'Recent engagement rate'],
      processingLogic: 'Projects the seven-day follower trend using recent velocity and posting frequency.',
      confidence: 83,
      output: 'Near-term follower growth is likely to continue.',
      suggestedAction: 'Maintain the current cadence and review forecast error after seven days.',
      supportingMetrics: ['Follower velocity is positive', '30-day engagement rate remains above baseline'],
    },
  ];
};

const buildPremiumScores = (): PremiumScores => ({
  aiGrowthScore: {
    score: 86,
    trend: 10,
    title: 'AI Growth Score',
    description: 'AI estimate combining engagement rate, follower velocity, and profile view growth.',
    inputs: ['Engagement rate', 'Follower velocity', 'Profile views growth'],
    processingLogic: 'Weighted normalized score: engagement 45%, follower velocity 35%, profile view growth 20%.',
    confidence: 84,
  },
  audienceQualityScore: {
    score: 89,
    trend: 5,
    title: 'Audience Quality Score',
    description: 'AI estimate based on seniority, industry, and job-title alignment from LinkedIn audience demographics.',
    inputs: ['Audience seniority', 'Audience industries', 'Audience job titles'],
    processingLogic: 'Scores fit against the configured target persona distribution.',
    confidence: 81,
  },
  postingHabitScore: {
    score: 68,
    trend: -4,
    title: 'Posting Habit Score',
    description: 'AI estimate based on posting consistency, format diversity, and observed publish-time performance.',
    inputs: ['Published timestamps', 'Content types', 'Engagement by publish time'],
    processingLogic: 'Combines cadence regularity, format mix, and publish-time engagement variance.',
    confidence: 78,
  },
});

const validateDataset = (dataset: LinkedInAnalyticsDataset) => {
  const percentages = [
    dataset.overviewMetrics.engagementRate,
    dataset.overviewMetrics.followersGrowth,
    ...dataset.posts.flatMap((post) => [post.ctr, post.engagementRate]),
    ...Object.values(dataset.audienceData).flatMap((segments) => segments.map((segment) => segment.pct)),
  ];

  const hasInvalidNumber =
    dataset.posts.some((post) =>
      [
        post.impressions,
        post.uniqueImpressions,
        post.clicks,
        post.comments,
        post.reposts,
        post.shares,
        post.score,
      ].some((value) => !Number.isFinite(value) || value < 0),
    ) ||
    dataset.followerGrowthTimeline.some((point) => !Number.isFinite(point.value) || point.value < 0) ||
    percentages.some((value) => !Number.isFinite(value) || value < -100 || value > 100);

  if (hasInvalidNumber) {
    throw new Error('LinkedIn analytics mock dataset contains invalid metric values.');
  }
};

export const buildLinkedInAnalyticsDataset = (): LinkedInAnalyticsDataset => {
  const posts = buildPosts();
  const impressionsHistory = buildImpressionsHistory(posts);
  const followerGrowthTimeline = buildFollowerTimeline();
  const followerForecast = buildFollowerForecast(followerGrowthTimeline);
  const heatmapData = buildHeatmap(posts);
  const overviewMetrics = buildOverview(posts, impressionsHistory, followerGrowthTimeline);
  const followersData = buildFollowerStats(followerGrowthTimeline);
  const profileAnalytics = buildProfileAnalytics(impressionsHistory);
  const aiInsights = buildAiInsights(posts, overviewMetrics);
  const premiumScores = buildPremiumScores();

  const dataset = {
    overviewMetrics,
    impressionsHistory,
    followerGrowthTimeline,
    followerForecast,
    heatmapData,
    followersData,
    audienceData,
    profileAnalytics,
    posts,
    aiInsights,
    premiumScores,
  };

  validateDataset(dataset);

  return dataset;
};
