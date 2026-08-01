export type AppName = 'instagram' | 'x' | 'linkedin' | 'github' | 'leetcode' | 'tiktok' | 'facebook' | 'google-calendar';

export interface AppConnection {
  id: AppName;
  name: string;
  connected: boolean;
  icon: string; // Will correspond to lucide icons or simple shapes
}

export interface SocialAccount {
  id: string;
  appId: AppName;
  username: string;
  avatarUrl: string;
  followers: number;
  engagementScore: number;
}

export interface PostAnalytics {
  id: string;
  accountId: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  postedAt: string;
}
