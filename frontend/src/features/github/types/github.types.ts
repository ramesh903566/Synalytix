export interface GithubProfile {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  company: string;
  website: string;
  location: string;
  email: string;
  createdAt: string;
  followers: { totalCount: number };
  following: { totalCount: number };
  repositories: { totalCount: number };
  gists: { totalCount: number };
  isHireable: boolean;
  organizations: {
    nodes: Array<{ name: string; avatarUrl: string }>;
  };
  scores: {
    completion: number;
    developer: number;
    trust: number;
    activityLevel: number;
    openSource: number;
  };
}

export interface GithubContributions {
  totalContributions: number;
  streak: { current: number; longest: number };
  activeDay: string;
  activeMonth: string;
  averagePerDay: number;
  calendar: Array<{
    date: string;
    count: number;
    level: number;
  }>;
}

export interface GithubActivity {
  commits: { count: number; percentage: number; delta: string };
  prs: { count: number; percentage: number; delta: string };
  issues: { count: number; percentage: number; delta: string };
  reviews: { count: number; percentage: number; delta: string };
  discussions: { count: number; percentage: number; delta: string };
}

export interface GithubRepository {
  name: string;
  description: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: { name: string; color: string } | null;
  updatedAt: string;
  issues: number;
  watchers: number;
  size: number;
  healthScore: number;
  activityScore: number;
  licenseInfo: { name: string } | null;
  topics: string[];
}

export interface GithubLanguage {
  name: string;
  bytes: number;
  color: string;
}

export interface GithubTimelineEvent {
  id: number;
  type: string;
  repo: string;
  description: string;
  timestamp: string;
}
