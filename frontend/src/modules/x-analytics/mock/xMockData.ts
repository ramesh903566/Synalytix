import { AIInsight, ContentPost, KPI, LiveBroadcast, Space, VideoStats } from '../types/xAnalytics';

// Helper to generate sparkline data
const generateSparkline = (base: number, volatility: number = 0.2) => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    value: Math.floor(base + (Math.random() - 0.5) * base * volatility),
  }));
};

export const MOCK_KPIS: Record<string, KPI> = {
  impressions: { id: 'impressions', label: 'Impressions', value: 2450000, change: 12.4, trend: 'up', history: generateSparkline(80000) },
  reach: { id: 'reach', label: 'Reach', value: 1800000, change: 8.2, trend: 'up', history: generateSparkline(60000) },
  followers: { id: 'followers', label: 'Followers', value: 142500, change: 2.1, trend: 'up', history: generateSparkline(140000, 0.05) },
  followerGrowth: { id: 'followerGrowth', label: 'Follower Growth', value: 3450, change: -1.5, trend: 'down', history: generateSparkline(115, 0.5) },
  profileVisits: { id: 'profileVisits', label: 'Profile Visits', value: 89200, change: 15.3, trend: 'up', history: generateSparkline(3000) },
  likes: { id: 'likes', label: 'Likes', value: 452000, change: 5.1, trend: 'up', history: generateSparkline(15000) },
  replies: { id: 'replies', label: 'Replies', value: 42100, change: 1.2, trend: 'up', history: generateSparkline(1400) },
  reposts: { id: 'reposts', label: 'Reposts', value: 18500, change: -4.2, trend: 'down', history: generateSparkline(600) },
  bookmarks: { id: 'bookmarks', label: 'Bookmarks', value: 24300, change: 22.1, trend: 'up', history: generateSparkline(800) },
  shares: { id: 'shares', label: 'Shares', value: 12100, change: 8.4, trend: 'up', history: generateSparkline(400) },
  mediaViews: { id: 'mediaViews', label: 'Media Views', value: 1250000, change: 45.2, trend: 'up', history: generateSparkline(41000) },
  linkClicks: { id: 'linkClicks', label: 'Link Clicks', value: 32400, change: -2.1, trend: 'down', history: generateSparkline(1080) },
  creatorScore: { id: 'creatorScore', label: 'Creator Score', value: 92, change: 4.5, trend: 'up' },
  viralityScore: { id: 'viralityScore', label: 'Virality Score', value: 78, change: 12.1, trend: 'up' },
  audienceScore: { id: 'audienceScore', label: 'Audience Score', value: 85, change: 1.2, trend: 'up' },
  momentumScore: { id: 'momentumScore', label: 'Momentum Score', value: 88, change: 8.9, trend: 'up' },
};

export const MOCK_CONTENT: ContentPost[] = [
  { id: '1', content: 'Just launched our new AI features! 🚀', type: 'Text', publishedAt: '2023-10-24T10:00:00Z', impressions: 125000, likes: 4500, replies: 320, reposts: 890, bookmarks: 1200, shares: 450, engagementRate: 5.8, profileVisits: 1200, status: 'Published' },
  { id: '2', content: 'Here is a breakdown of the new architecture.', type: 'Thread', publishedAt: '2023-10-23T14:30:00Z', impressions: 85000, likes: 2100, replies: 150, reposts: 420, bookmarks: 850, shares: 210, engagementRate: 4.3, profileVisits: 850, status: 'Published' },
  { id: '3', content: 'Behind the scenes at HQ 🏢', type: 'Image', publishedAt: '2023-10-22T09:15:00Z', impressions: 210000, likes: 8900, replies: 450, reposts: 1200, bookmarks: 450, shares: 890, engagementRate: 5.6, profileVisits: 2100, status: 'Published' },
  { id: '4', content: 'Video demo of the new UI', type: 'Video', publishedAt: '2023-10-21T16:45:00Z', impressions: 345000, likes: 12400, replies: 890, reposts: 2100, bookmarks: 3200, shares: 1500, engagementRate: 5.8, profileVisits: 4500, status: 'Published' },
  { id: '5', content: 'Check out our latest blog post on scaling', type: 'Link', publishedAt: '2023-10-20T11:20:00Z', impressions: 45000, likes: 890, replies: 45, reposts: 120, bookmarks: 340, shares: 89, engagementRate: 3.2, profileVisits: 450, status: 'Published' },
  { id: '6', content: 'Drafting some new ideas for next quarter', type: 'Text', publishedAt: '2023-10-25T10:00:00Z', impressions: 0, likes: 0, replies: 0, reposts: 0, bookmarks: 0, shares: 0, engagementRate: 0, profileVisits: 0, status: 'Draft' },
  { id: '7', content: 'Big announcement tomorrow!', type: 'Text', publishedAt: '2023-10-26T09:00:00Z', impressions: 0, likes: 0, replies: 0, reposts: 0, bookmarks: 0, shares: 0, engagementRate: 0, profileVisits: 0, status: 'Scheduled' },
];

export const MOCK_VIDEOS: VideoStats[] = [
  { id: 'v1', title: 'Product Launch Keynote', publishedAt: '2023-10-10T10:00:00Z', views: 450000, watchTimeHours: 12500, avgWatchDurationSeconds: 100, completionRate: 45, performanceScore: 92 },
  { id: 'v2', title: 'Tutorial: Getting Started', publishedAt: '2023-10-12T14:30:00Z', views: 120000, watchTimeHours: 4500, avgWatchDurationSeconds: 135, completionRate: 65, performanceScore: 88 },
  { id: 'v3', title: 'Feature Highlight: AI Insights', publishedAt: '2023-10-15T09:15:00Z', views: 85000, watchTimeHours: 1200, avgWatchDurationSeconds: 50, completionRate: 35, performanceScore: 75 },
];

export const MOCK_LIVE: LiveBroadcast[] = [
  { id: 'l1', title: 'Weekly Q&A Session', startedAt: '2023-10-20T17:00:00Z', endedAt: '2023-10-20T18:00:00Z', status: 'Ended', peakViewers: 1200, avgWatchTimeMinutes: 25, durationMinutes: 60, replayViews: 4500 },
  { id: 'l2', title: 'Emergency Bug Fix Update', startedAt: '2023-10-22T10:00:00Z', endedAt: '2023-10-22T10:15:00Z', status: 'Ended', peakViewers: 4500, avgWatchTimeMinutes: 8, durationMinutes: 15, replayViews: 12000 },
  { id: 'l3', title: 'Live Coding: Building a Dashboard', startedAt: '2023-10-25T15:00:00Z', status: 'Live', concurrentViewers: 850, peakViewers: 850, avgWatchTimeMinutes: 15, durationMinutes: 30, replayViews: 0 },
];

export const MOCK_SPACES: Space[] = [
  { id: 's1', title: 'Tech Trends 2024', status: 'Ended', listeners: 15000, peakListeners: 4500, speakersCount: 5, durationMinutes: 120, replayEnabled: true, retentionRate: 45 },
  { id: 's2', title: 'Design Systems Deep Dive', status: 'Ended', listeners: 8500, peakListeners: 2100, speakersCount: 3, durationMinutes: 90, replayEnabled: true, retentionRate: 65 },
  { id: 's3', title: 'Founder AMA', status: 'Scheduled', scheduledFor: '2023-10-30T18:00:00Z', listeners: 0, peakListeners: 0, speakersCount: 1, durationMinutes: 0, replayEnabled: true, retentionRate: 0 },
];

export const MOCK_AI_INSIGHTS: AIInsight[] = [
  { id: 'i1', title: 'Best Posting Time', description: 'Posting between 9AM and 11AM EST generates 2.4x more impressions for your audience.', type: 'action', confidence: 94, actionText: 'Schedule Posts', priority: 'high' },
  { id: 'i2', title: 'Engagement Decline', description: 'Replies are down 12% this week. Consider asking more questions in your threads.', type: 'warning', confidence: 88, actionText: 'View Tips', priority: 'medium' },
  { id: 'i3', title: 'Content Recommendation', description: 'Videos about "System Architecture" have a 65% higher completion rate.', type: 'opportunity', confidence: 91, actionText: 'Draft Video', priority: 'high' },
  { id: 'i4', title: 'Audience Activity', description: 'Your followers are most active on Tuesdays and Thursdays.', type: 'insight', confidence: 98, priority: 'low' },
];

export const MOCK_AUDIENCE_HEATMAP = Array.from({ length: 7 }, (_, day) => 
  Array.from({ length: 24 }, (_, hour) => ({
    day,
    hour,
    value: Math.floor(Math.random() * 100),
  }))
);

export const MOCK_AUDIENCE_DEMOGRAPHICS = {
  gender: [
    { name: 'Male', value: 65 },
    { name: 'Female', value: 32 },
    { name: 'Other', value: 3 },
  ],
  age: [
    { name: '18-24', value: 15 },
    { name: '25-34', value: 45 },
    { name: '35-44', value: 25 },
    { name: '45-54', value: 10 },
    { name: '55+', value: 5 },
  ],
  countries: [
    { name: 'United States', value: 45 },
    { name: 'United Kingdom', value: 15 },
    { name: 'India', value: 12 },
    { name: 'Canada', value: 8 },
    { name: 'Australia', value: 5 },
    { name: 'Other', value: 15 },
  ]
};
