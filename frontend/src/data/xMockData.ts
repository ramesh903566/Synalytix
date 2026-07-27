export const X_OVERVIEW = {
  impressions: { value: 2450000, change: 12.4, history: Array.from({ length: 30 }, (_, i) => ({ date: `Dec ${i + 1}`, value: Math.floor(Math.random() * 50000) + 10000 })) },
  reach: { value: 1800000, change: 8.2 },
  engagements: { value: 125000, change: -2.4 },
  engagementRate: { value: 5.1, change: 0.8 },
  followers: { value: 142500, change: 1.5, history: Array.from({ length: 30 }, (_, i) => ({ date: `Dec ${i + 1}`, value: Math.floor(Math.random() * 100) - 20 })) },
  followerGrowth: { value: 1240, change: 15.2 },
  profileVisits: { value: 45000, change: 22.1 },
  likes: { value: 85000, change: 5.4 },
  replies: { value: 12000, change: 1.2 },
  reposts: { value: 25000, change: 18.7 },
  bookmarks: { value: 8500, change: 42.1 },
  shares: { value: 3200, change: -5.4 },
  mediaViews: { value: 850000, change: 14.5 },
  linkClicks: { value: 18000, change: 2.1 },
  verifiedFollowers: { value: 1250, change: 8.4 },
  creatorScore: { value: 92, change: 4 },
  viralityScore: { value: 88, change: -2 },
  momentumScore: { value: 95, change: 12 },
  contentQuality: { value: 85, change: 2 },
  audienceQuality: { value: 91, change: 1 },
};

export const X_AI_INSIGHTS = [
  { id: 1, type: 'opportunity', title: 'Best Posting Time', description: 'Your audience is highly active between 8 AM and 10 AM EST on Tuesdays. Posting then increases reach by 24%.', confidence: 94, actionText: 'Schedule Post' },
  { id: 2, type: 'warning', title: 'Engagement Drop', description: 'Replies are down 12% this week. Ask more questions in your threads to spark conversation.', confidence: 88, actionText: 'View Content Tips' },
  { id: 3, type: 'success', title: 'Momentum Gaining', description: 'Your recent thread on AI agents gained 4x more bookmarks than average. This is a high-value topic.', confidence: 96, actionText: 'Analyze Thread' },
];

export const X_AUDIENCE = {
  age: [
    { range: '18-24', pct: 25 },
    { range: '25-34', pct: 45 },
    { range: '35-44', pct: 20 },
    { range: '45+', pct: 10 },
  ],
  gender: { male: 68, female: 30, other: 2 },
  countries: [
    { name: 'United States', pct: 42 },
    { name: 'United Kingdom', pct: 15 },
    { name: 'India', pct: 12 },
    { name: 'Canada', pct: 8 },
    { name: 'Other', pct: 23 },
  ],
  devices: [
    { name: 'iOS', pct: 55 },
    { name: 'Android', pct: 30 },
    { name: 'Desktop', pct: 15 },
  ],
  activeHours: Array.from({ length: 7 }, (_, day) => 
    Array.from({ length: 24 }, (_, hour) => ({
      day, hour, value: Math.floor(Math.random() * 100)
    }))
  ).flat()
};

export const X_CONTENT = Array.from({ length: 50 }, (_, i) => ({
  id: `post-${i}`,
  date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
  text: `This is a sample post about tech and design. Learning a lot today! #learning #tech (${i})`,
  impressions: Math.floor(Math.random() * 500000) + 1000,
  likes: Math.floor(Math.random() * 15000) + 50,
  replies: Math.floor(Math.random() * 1000) + 5,
  reposts: Math.floor(Math.random() * 5000) + 10,
  bookmarks: Math.floor(Math.random() * 2000) + 5,
  shares: Math.floor(Math.random() * 500) + 1,
  type: Math.random() > 0.8 ? 'Thread' : Math.random() > 0.5 ? 'Media' : 'Text',
  hasMedia: Math.random() > 0.6,
  engagementRate: (Math.random() * 10).toFixed(2)
})).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const X_VIDEO = {
  views: 850000,
  watchTimeHrs: 14200,
  completionRate: 42.5,
  avgWatchDurationSec: 45,
  funnel: [
    { stage: 'Started', pct: 100 },
    { stage: '10s mark', pct: 75 },
    { stage: '25% mark', pct: 60 },
    { stage: '50% mark', pct: 45 },
    { stage: 'Completed', pct: 42.5 },
  ],
  topVideos: Array.from({ length: 5 }, (_, i) => ({
    id: `vid-${i}`,
    title: `Amazing product demo ${i + 1}`,
    views: Math.floor(Math.random() * 200000) + 10000,
    completion: Math.floor(Math.random() * 50) + 20,
    retention: Math.floor(Math.random() * 40) + 30
  }))
};

export const X_LIVE = {
  totalBroadcasts: 12,
  peakViewersAvg: 4500,
  durationAvgMins: 45,
  recent: Array.from({ length: 4 }, (_, i) => ({
    id: `live-${i}`,
    title: `Live QA Session #${i + 1}`,
    date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    peakViewers: Math.floor(Math.random() * 8000) + 1000,
    concurrentTimeline: Array.from({ length: 20 }, (_, j) => ({ time: j * 5, viewers: Math.floor(Math.random() * 5000) + 500 })),
    replayViews: Math.floor(Math.random() * 20000) + 5000
  }))
};

export const X_SPACES = {
  totalHosted: 8,
  listenersAvg: 1250,
  durationAvgMins: 65,
  recent: Array.from({ length: 5 }, (_, i) => ({
    id: `space-${i}`,
    title: `Tech Talk: Future of AI in Design #${i + 1}`,
    status: i === 0 ? 'Live' : i === 1 ? 'Scheduled' : 'Ended',
    date: new Date(Date.now() - Math.floor((i - 1) * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    listeners: i === 1 ? 0 : Math.floor(Math.random() * 3000) + 500,
    speakers: Math.floor(Math.random() * 5) + 2,
    duration: i === 1 ? 0 : Math.floor(Math.random() * 90) + 30
  }))
};
