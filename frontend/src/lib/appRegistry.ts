// Static app registry — no mock data, just UI metadata
export interface AppMeta {
  id: string;
  name: string;
  iconUrl: string;
  category: 'social' | 'dev' | 'fitness';
  color: string;
}

export const APP_REGISTRY: AppMeta[] = [
  { id: 'github', name: 'GitHub', iconUrl: '/icons/github.png', category: 'dev', color: '#8b5cf6' },
  { id: 'instagram', name: 'Instagram', iconUrl: '/icons/instagram.jpeg', category: 'social', color: '#e1306c' },
  { id: 'x', name: 'X (Twitter)', iconUrl: '/icons/x.jpeg', category: 'social', color: '#1d9bf0' },
  { id: 'linkedin', name: 'LinkedIn', iconUrl: '/icons/linkedin.jpeg', category: 'social', color: '#0a66c2' },
  { id: 'leetcode', name: 'LeetCode', iconUrl: '/icons/leetcode.png', category: 'dev', color: '#ffa116' },
  { id: 'tiktok', name: 'TikTok', iconUrl: '/icons/tiktok.jpeg', category: 'social', color: '#000000' },
  { id: 'facebook', name: 'Facebook', iconUrl: '/icons/facebook.jpeg', category: 'social', color: '#1877f2' },
];

export const getAppMeta = (id: string): AppMeta | undefined =>
  APP_REGISTRY.find(a => a.id === id);
