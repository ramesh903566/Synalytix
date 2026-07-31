export type Platform = 'github' | 'instagram' | 'x' | 'linkedin' | 'leetcode' | 'google-calendar';

export interface PlatformConnection {
  id: string;
  user_id: string;
  platform: Platform;
  access_token: string | null;
  refresh_token: string | null;
  expires_at: string | null;
  platform_user_id: string;
  platform_username: string;
  scope: string | null;
  created_at: string;
  updated_at: string;
}

export interface OAuthState {
  user_id: string;
  platform: Platform;
  state_token: string;
  code_verifier?: string;
  created_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GitHubProfile {
  platform: 'github';
  username: string;
  name: string;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  is_private: boolean;
  updated_at: string;
}

export interface InstagramProfile {
  platform: 'instagram';
  id: string;
  username: string;
  name: string;
  biography: string | null;
  followers_count: number;
  follows_count: number;
  media_count: number;
  profile_picture_url: string | null;
  website: string | null;
  account_type: string;
}

export interface InstagramInsights {
  impressions: number;
  reach: number;
  profile_views: number;
  follower_count: number;
  accounts_engaged: number;
}

export interface InstagramMedia {
  id: string;
  caption: string | null;
  media_type: string;
  media_url: string | null;
  permalink: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
  insights?: {
    impressions: number;
    reach: number;
    plays?: number;
    saved?: number;
    shares?: number;
  };
}

export interface XProfile {
  platform: 'x';
  id: string;
  username: string;
  name: string;
  description: string | null;
  profile_image_url: string | null;
  followers_count: number;
  following_count: number;
  tweet_count: number;
}

export interface XTweetMetrics {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
    impression_count: number;
  };
}

export interface LinkedInProfile {
  platform: 'linkedin';
  id: string;
  first_name: string;
  last_name: string;
  headline: string | null;
  profile_picture_url: string | null;
}

export interface LeetCodeStats {
  platform: 'leetcode';
  username: string;
  total_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  total_submissions: number;
  acceptance_rate: number;
  ranking: number;
}

export interface LeetCodeRecentSubmission {
  title: string;
  title_slug: string;
  timestamp: string;
  status_display: string;
  lang: string;
}

export interface LeetCodeProfileSnapshot {
  id: string;
  user_id: string;
  timestamp: string;
  ranking: number | null;
  contest_rating: number | null;
  global_ranking: number | null;
  easy_solved: number | null;
  medium_solved: number | null;
  hard_solved: number | null;
  acceptance_rate: number | null;
  reputation: number | null;
  streak: number | null;
  activity_summary: any | null;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}
