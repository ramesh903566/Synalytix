import { DateRange, KPI, ContentPost, VideoStats, LiveBroadcast, Space } from '../types/xAnalytics';
import { supabase } from '../../../lib/supabase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function xFetch<T>(path: string): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`X API error: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch X data');
  return json.data;
}

export class XApiClient {

  static async getOverviewKPIs(dateRange: DateRange): Promise<Record<string, KPI>> {
    const data = await xFetch<any>('/api/data/x/all');
    const profile = data?.profile || {};
    const tweets = data?.tweets || [];

    return {
      impressions: { id: 'impressions', value: profile.impressions || 0, label: 'Impressions', trend: 'neutral', change: 0 },
      engagements: { id: 'engagements', value: profile.engagements || 0, label: 'Engagements', trend: 'neutral', change: 0 },
      followers: { id: 'followers', value: profile.followers || 0, label: 'Followers', trend: 'neutral', change: 0 },
      profileViews: { id: 'profileViews', value: profile.profile_views || 0, label: 'Profile Views', trend: 'neutral', change: 0 },
    };
  }

  static async getAudienceDemographics(_dateRange: DateRange) {
    return { age: [], gender: [], location: [] };
  }

  static async getAudienceActivityHeatmap(_dateRange: DateRange) {
    return [];
  }

  static async getContentPosts(_dateRange: DateRange, _page = 1): Promise<ContentPost[]> {
    const data = await xFetch<any>('/api/data/x/all');
    const tweets = data?.tweets || [];
    return tweets.map((t: any) => ({
      id: t.id,
      text: t.text || '',
      createdAt: t.created_at || new Date().toISOString(),
      likes: t.like_count || 0,
      retweets: t.retweet_count || 0,
      replies: t.reply_count || 0,
      impressions: t.impression_count || 0,
      engagementRate: 0,
    }));
  }

  static async getVideoStats(_dateRange: DateRange): Promise<VideoStats[]> {
    return [];
  }

  static async getLiveBroadcasts(_dateRange: DateRange): Promise<LiveBroadcast[]> {
    return [];
  }

  static async getSpaces(_dateRange: DateRange): Promise<Space[]> {
    return [];
  }
}
