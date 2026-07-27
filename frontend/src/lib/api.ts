import { 
  IG_OVERVIEW, IG_AUDIENCE, IG_CONTENT_POSTS,
  MOCK_ACCOUNTS, MOCK_APPS
} from '../data/mockData';

type ApiEnvelope<T = any> = {
  success: boolean;
  data?: T;
  error?: string | { message?: string };
  message?: string;
};

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export async function connectPlatform(platform: string): Promise<void> {
  await delay();
  console.log(`Mock connect to ${platform}`);
}

export async function getConnectionStatus(): Promise<ApiEnvelope<{ connected: string[] }>> {
  await delay();
  return {
    success: true,
    data: { connected: ['instagram', 'x', 'github', 'linkedin', 'leetcode'] }
  };
}

export async function disconnectPlatform(platform: string): Promise<ApiEnvelope> {
  await delay();
  return { success: true };
}

export async function getDashboardSummary(): Promise<ApiEnvelope> {
  await delay();
  return {
    success: true,
    data: {
      totalInteractions: 8200,
      totalReach: 45000,
      recentActivity: [],
      // Mock some summary data based on MOCK_ACCOUNTS
    }
  };
}

export async function getGitHubData(): Promise<ApiEnvelope> {
  await delay();
  return {
    success: true,
    data: {
      account: MOCK_ACCOUNTS.github[0],
      overview: { commits: 120, PRs: 15, issues: 5 },
      repos: []
    }
  };
}

export async function getInstagramData(): Promise<ApiEnvelope> {
  await delay();
  return {
    success: true,
    data: {
      account: MOCK_ACCOUNTS.instagram[0],
      overview: IG_OVERVIEW,
      audience: IG_AUDIENCE,
      content: IG_CONTENT_POSTS,
    }
  };
}

export async function getXData(): Promise<ApiEnvelope> {
  await delay();
  return {
    success: true,
    data: {
      account: MOCK_ACCOUNTS.x[0],
      overview: { impressions: 12000, retweets: 150, likes: 500 },
      tweets: []
    }
  };
}

export async function getLeetCodeData(): Promise<ApiEnvelope> {
  await delay();
  return {
    success: true,
    data: {
      account: MOCK_ACCOUNTS.leetcode[0],
      overview: { solved: 250, easy: 100, medium: 120, hard: 30 },
      recentSubmissions: []
    }
  };
}

export async function getLinkedInData(): Promise<ApiEnvelope> {
  await delay();
  return {
    success: true,
    data: {
      account: MOCK_ACCOUNTS.linkedin[0],
      overview: { connections: 500, profileViews: 120 },
      posts: []
    }
  };
}

export async function connectLeetCode(username: string): Promise<ApiEnvelope> {
  await delay();
  return { success: true };
}

export async function generateRecommendations(options?: {
  forceRefresh?: boolean;
  focusCategory?: string;
}): Promise<ApiEnvelope> {
  await delay(1500);
  return {
    success: true,
    data: {
      recommendations: [
        {
          id: 'rec_1',
          type: 'content',
          title: 'Post a new Reel',
          description: 'Your audience is most active on Tuesdays. Post a new reel to maximize reach.',
          status: 'pending'
        }
      ]
    }
  };
}

export async function getRecommendationHistory(): Promise<ApiEnvelope> {
  await delay();
  return {
    success: true,
    data: []
  };
}

export async function completeRecommendation(id: string): Promise<ApiEnvelope> {
  await delay();
  return { success: true };
}

export async function dismissRecommendation(id: string): Promise<ApiEnvelope> {
  await delay();
  return { success: true };
}
