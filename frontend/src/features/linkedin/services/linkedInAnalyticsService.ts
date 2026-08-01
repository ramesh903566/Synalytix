import { supabase } from '../../../lib/supabase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

let cachedData: any = null;

async function ensureData() {
  if (cachedData) return cachedData;
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(`${API_BASE}/api/data/linkedin/all`, {
    headers: {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json.success) return null;
  cachedData = json.data;
  return cachedData;
}

// Pre-fetch on module load
ensureData();

function getOverviewSync() {
  const data = cachedData;
  const profile = data?.profile || {};
  const posts = data?.posts || [];
  return {
    followers: profile.followers_count || 0,
    impressions: posts.reduce((sum: number, p: any) => sum + (p.impressions || 0), 0),
    engagement: posts.reduce((sum: number, p: any) => sum + (p.engagement || 0), 0),
    profileViews: profile.profile_views || 0,
    contentMixLeader: '',
    impressionsGrowth: 0,
    profileViewsGrowth: 0,
    searchAppearances: 0,
    searchAppearancesGrowth: 0,
    engagementRate: 0,
  };
}

export class LinkedInAnalyticsService {
  static getOverviewMetrics() {
    return getOverviewSync();
  }

  static getImpressionsHistory() {
    return [];
  }

  static getEngagementHeatmap() {
    return [];
  }

  static getDataset() {
    return cachedData || {};
  }
}
