export const MOCK_APPS = [
  { id: 'instagram', name: 'Instagram', color: 'text-pink-600', iconUrl: '/icons/instagram.jpeg' },
  { id: 'x', name: 'X (Twitter)', color: 'text-black', iconUrl: '/icons/x.jpeg' },
  { id: 'linkedin', name: 'LinkedIn', color: 'text-blue-600', iconUrl: '/icons/linkedin.jpeg' },
  { id: 'github', name: 'GitHub', color: 'text-gray-800', iconUrl: '/icons/github.png' },
  { id: 'leetcode', name: 'LeetCode', color: 'text-yellow-600', iconUrl: '/icons/leetcode.png' },
  { id: 'tiktok', name: 'TikTok', color: 'text-black', iconUrl: '/icons/tiktok.jpeg' },
  { id: 'facebook', name: 'Facebook', color: 'text-blue-800', iconUrl: '/icons/facebook.jpeg' }
] as const;

export const MOCK_ACCOUNTS: Record<string, any[]> = {
  instagram: [
    { id: 'ig_1', username: '@ramesh988025', avatarUrl: 'https://i.pravatar.cc/150?u=ig_ramesh', type: 'creator' },
  ],
  x: [
    { id: 'x_1', username: '@ramesh903566', avatarUrl: 'https://i.pravatar.cc/150?u=x_ramesh', type: 'personal', isPremium: true },
    { id: 'x_2', username: '@free_user', avatarUrl: 'https://i.pravatar.cc/150?u=x_free', type: 'personal', isPremium: false },
  ],
  linkedin: [
    { id: 'li_1', username: 'Ramesh Kumar', avatarUrl: 'https://i.pravatar.cc/150?u=li_ramesh', type: 'professional' },
  ],
  github: [
    { id: 'gh_1', username: 'ramesh988025', avatarUrl: 'https://i.pravatar.cc/150?u=gh_ramesh', type: 'developer' },
  ],
  leetcode: [
    { id: 'lc_1', username: 'ramesh_codes', avatarUrl: 'https://i.pravatar.cc/150?u=lc_ramesh', type: 'competitive' },
  ]
};

export const MOCK_POSTS = [
  { id: 'p1', content: 'NAM HORI 🐮 — viral reel hitting 16.9K views!', likes: 1100, comments: 6, shares: 9, date: '2w ago', views: 16900, app: 'instagram' },
  { id: 'p2', content: 'From my room to your screen 🍳 SIMPLE, SPICY & SATISFYING!', likes: 244, comments: 5, shares: 5, date: '2w ago', views: 5100, app: 'instagram' },
  { id: 'p3', content: '"One day you\'ll watch me" — live show moment ✨', likes: 219, comments: 6, shares: 7, date: '3w ago', views: 5100, app: 'instagram' },
  { id: 'p4', content: 'Building Synalytix 🚀 AI-powered dashboard for developers & creators', likes: 0, comments: 0, shares: 0, date: 'May 20', views: 2, app: 'x' },
];

// --- Instagram Full Insights Data ---
export const IG_OVERVIEW = {
  allContent: {
    views: 53607,
    netFollowers: 19,
    interactions: 3344,
    accountsReached: 20394,
    followers_pct: 42.4,
    nonfollowers_pct: 57.6,
    reelViews: 36000,
    storyViews: 13000,
    postViews: 3800,
    liveViews: 0,
    reelInteractions: 2500,
    storyInteractions: 639,
    postInteractions: 200,
    liveInteractions: 0,
    profileVisits: 1098,
    bioLinkTaps: 31,
    businessAddressTaps: 0,
  },
  viewsHistory: [
    { date: '23 Apr', val: 800 }, { date: '25 Apr', val: 1200 }, { date: '27 Apr', val: 600 },
    { date: '29 Apr', val: 2800 }, { date: '1 May', val: 1800 }, { date: '3 May', val: 3200 },
    { date: '5 May', val: 2400 }, { date: '7 May', val: 9600 }, { date: '9 May', val: 3100 },
    { date: '11 May', val: 1900 }, { date: '13 May', val: 2200 }, { date: '15 May', val: 1600 },
    { date: '17 May', val: 800 }, { date: '19 May', val: 400 }, { date: '22 May', val: 200 },
  ],
};

export const IG_AUDIENCE = {
  followers: 488,
  followerGrowth: 4.1,
  followersSince: 'Apr 23',
  gender: { women: 17.4, men: 82.6 },
  age: [
    { range: '13–17', pct: 6.1 }, { range: '18–24', pct: 73.8 },
    { range: '25–34', pct: 12.5 }, { range: '35–44', pct: 3.8 },
    { range: '45–54', pct: 3.2 }, { range: '55–64', pct: 0.3 }, { range: '65+', pct: 0.3 },
  ],
  topCountry: { name: 'India', pct: 100 },
  followerGrowthHistory: [
    { date: '23 Apr', val: 0 }, { date: '25 Apr', val: 2 }, { date: '27 Apr', val: -1 },
    { date: '29 Apr', val: 3 }, { date: '1 May', val: 1 }, { date: '3 May', val: -2 },
    { date: '5 May', val: 2 }, { date: '7 May', val: 1 }, { date: '9 May', val: 2 },
    { date: '11 May', val: -1 }, { date: '13 May', val: 3 }, { date: '15 May', val: 1 },
    { date: '17 May', val: 0 }, { date: '19 May', val: 2 }, { date: '22 May', val: 4 },
  ],
  activeTimes: {
    sunday: [30, 10, 55, 70, 75, 65, 80, 60],
  },
  topTimes: ['Mondays 18–21', 'Tuesdays 18–21', 'Wednesdays 18–21'],
};

export const IG_CONTENT_POSTS = [
  { id: 'c1', emoji: '😍✨', age: '3d', likes: 36, reposts: 0, shares: 0, views: 476, accountsReached: 341, follows: 0, saves: 0, comments: 0 },
  { id: 'c2', emoji: '🕌', age: '4d', likes: 37, reposts: 1, shares: 0, views: 522, accountsReached: 509, follows: 0, saves: 0, comments: 0 },
  { id: 'c3', emoji: '👨‍👩‍👧‍👦', age: '4d', likes: 40, reposts: 0, shares: 1, views: 484, accountsReached: 341, follows: 0, saves: 0, comments: 0 },
  { id: 'c4', emoji: '🎤', age: '1w', likes: 9, reposts: 0, shares: 0, views: 370, accountsReached: 0, follows: 0, saves: 0, comments: 0 },
  { id: 'c5', emoji: '🎉', age: '1w', likes: 29, reposts: 0, shares: 2, views: 827, accountsReached: 509, follows: 0, saves: 2, comments: 0 },
  { id: 'c6', emoji: '👯', age: '1w', likes: 41, reposts: 0, shares: 0, views: 574, accountsReached: 341, follows: 0, saves: 0, comments: 0 },
  { id: 'c7', emoji: '🎶', age: '1w', likes: 36, reposts: 0, shares: 0, views: 435, accountsReached: 0, follows: 0, saves: 0, comments: 0 },
  { id: 'c8', title: 'NAM HORI 🐮', age: '2w', likes: 1100, reposts: 7, shares: 9, views: 16900, accountsReached: 12400, follows: 4, saves: 2, comments: 6 },
  { id: 'c9', title: 'From my room to your s...', age: '2w', likes: 244, reposts: 3, shares: 5, views: 5100, accountsReached: 2500, follows: 1, saves: 10, comments: 5 },
  { id: 'c10', title: '"One day you\'ll watch m...', age: '3w', likes: 219, reposts: 4, shares: 7, views: 5100, accountsReached: 2700, follows: 1, saves: 5, comments: 6 },
  { id: 'c11', title: 'full video in YouTube ▶️...', age: '3w', likes: 123, reposts: 0, shares: 1, views: 2600, accountsReached: 1000, follows: 0, saves: 1, comments: 2 },
  { id: 'c12', title: 'DRAFT ☝️ 💖', age: '3w', likes: 151, reposts: 0, shares: 1, views: 2300, accountsReached: 1200, follows: 2, saves: 2, comments: 0 },
  { id: 'c13', title: 'DARLING 😘✨💖', age: '3w', likes: 149, reposts: 1, shares: 0, views: 1900, accountsReached: 643, follows: 1, saves: 0, comments: 0 },
];

import { PlatformAnalyticsData, PlatformType, CrossPlatformInsights } from '../types/analytics';
import { UniversalAIEngine } from '../utils/aiAnalyticsEngine';

export const UNIVERSAL_MOCK_DATA: Record<PlatformType, PlatformAnalyticsData | null> = {
  instagram: {
    platform: 'instagram',
    aggregatedMetrics: {
      views: 53607,
      engagements: 3344,
      followers: 488,
      reach: 20394,
    },
    accounts: [
      {
        id: 'ig_1',
        platform: 'instagram',
        handle: '@ramesh988025',
        name: 'Ramesh',
        profileImageUrl: 'https://i.pravatar.cc/150?u=ig_ramesh',
        overview: {
          views: 53607,
          engagements: 3344,
          followers: 488,
          reach: 20394,
        },
        growthHistory: IG_AUDIENCE.followerGrowthHistory.map(d => ({ date: d.date, value: d.val })),
        audience: IG_AUDIENCE,
        content: IG_CONTENT_POSTS.map(c => ({
          id: c.id,
          platform: 'instagram',
          accountId: 'ig_1',
          type: c.emoji ? 'Story' : 'Reel',
          title: c.title || c.emoji || 'Post',
          publishedAt: c.age,
          metrics: {
            views: c.views,
            engagements: c.likes + c.comments + c.shares,
            likes: c.likes,
            comments: c.comments,
            shares: c.shares,
            saves: c.saves,
            reach: c.accountsReached,
          }
        })),
        lastSynced: '2 mins ago',
      }
    ],
  },
  x: {
    platform: 'x',
    aggregatedMetrics: {
      views: 12500,
      engagements: 890,
      followers: 1200,
      reach: 8500,
    },
    accounts: [
      {
        id: 'x_1',
        platform: 'x',
        handle: '@ramesh903566',
        name: 'Ramesh Kumar',
        profileImageUrl: 'https://i.pravatar.cc/150?u=x_ramesh',
        overview: {
          views: 12500,
          engagements: 890,
          followers: 1200,
          reach: 8500,
        },
        growthHistory: [
          { date: '1 May', value: 10 }, { date: '2 May', value: -2 }, { date: '3 May', value: 15 }
        ],
        content: [],
        lastSynced: '1 hour ago',
      }
    ],
  },
  linkedin: null,
  github: {
    platform: 'github',
    aggregatedMetrics: {
      views: 0,
      engagements: 450, // commits/PRs
      followers: 45,
    },
    accounts: [
      {
        id: 'gh_1',
        platform: 'github',
        handle: 'ramesh988025',
        name: 'Ramesh Developer',
        profileImageUrl: 'https://i.pravatar.cc/150?u=gh_ramesh',
        overview: {
          views: 0,
          engagements: 450,
          followers: 45,
        },
        growthHistory: [],
        content: [],
        lastSynced: '10 mins ago',
      }
    ],
  },
  youtube: null,
  leetcode: null,
  hackerrank: null,
  codeforces: null,
  devto: null,
  medium: null,
  reddit: null,
  stackoverflow: null
};

// Generate AI Insights dynamically for mock data
Object.values(UNIVERSAL_MOCK_DATA).forEach(platformData => {
  if (platformData) {
    platformData.aiInsights = UniversalAIEngine.generateInsights(platformData.aggregatedMetrics);
    platformData.accounts.forEach(account => {
      account.aiInsights = UniversalAIEngine.generateInsights(account.overview);
    });
  }
});

export const MOCK_CROSS_PLATFORM_INSIGHTS: CrossPlatformInsights = UniversalAIEngine.generateCrossPlatformInsights(UNIVERSAL_MOCK_DATA);
