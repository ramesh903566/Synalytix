// Static app registry — no mock data, just UI metadata
export interface AppMeta {
  id: string;
  name: string;
  iconUrl: string;
  category: 'social' | 'dev' | 'fitness';
  color: string;
}

export const APP_REGISTRY: AppMeta[] = [
  { id: 'github', name: 'GitHub', iconUrl: 'https://github.githubassets.com/favicons/favicon-dark.svg', category: 'dev', color: '#8b5cf6' },
  { id: 'instagram', name: 'Instagram', iconUrl: 'https://static.cdninstagram.com/rsrc.php/v3/yr/r/fuzsK18Gwgz.png', category: 'social', color: '#e1306c' },
  { id: 'x', name: 'X (Twitter)', iconUrl: 'https://abs.twimg.com/favicons/twitter.3.ico', category: 'social', color: '#1d9bf0' },
  { id: 'linkedin', name: 'LinkedIn', iconUrl: 'https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x206673', category: 'social', color: '#0a66c2' },
  { id: 'leetcode', name: 'LeetCode', iconUrl: 'https://leetcode.com/favicon.ico', category: 'dev', color: '#ffa116' },
  { id: 'tiktok', name: 'TikTok', iconUrl: 'https://lf16-tiktok-web.tiktokcdn.com/obj/tiktok_web/tiktok_web_pkg/main/tiktok_web_icon.png', category: 'social', color: '#000000' },
  { id: 'facebook', name: 'Facebook', iconUrl: 'https://static.xx.fbcdn.net/rsrc.php/v3/yH/r/3rS0BxUF0Cd.png', category: 'social', color: '#1877f2' },
];

export const getAppMeta = (id: string): AppMeta | undefined =>
  APP_REGISTRY.find(a => a.id === id);
