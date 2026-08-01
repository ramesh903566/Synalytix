import axios from 'axios';
import { InstagramProfile, InstagramInsights, InstagramMedia } from '../types';

const GRAPH_API = 'https://graph.facebook.com/v19.0';

/**
 * InstagramService
 *
 * Uses the Meta Graph API to fetch Instagram data.
 *
 * IMPORTANT: The access_token here is a User Access Token from Meta.
 * The user must have a Professional (Creator or Business) Instagram account
 * connected to a Facebook Page for insights to work.
 */
export const InstagramService = {

  /**
   * Step 1 after OAuth: get the Instagram Business Account ID.
   * Meta gives you a Facebook User token → you need to find the IG account.
   */
  async getInstagramAccountId(accessToken: string): Promise<{
    ig_account_id: string;
    username: string;
    page_id: string;
  } | null> {
    // 1. Get Facebook pages the user manages
    const { data: pagesData } = await axios.get(`${GRAPH_API}/me/accounts`, {
      params: { access_token: accessToken },
    });

    if (!pagesData.data || pagesData.data.length === 0) {
      return null; // User has no Facebook pages
    }

    // 2. For each page, find the connected Instagram account
    for (const page of pagesData.data) {
      try {
        const { data: igData } = await axios.get(
          `${GRAPH_API}/${page.id}`,
          {
            params: {
              fields: 'instagram_business_account',
              access_token: page.access_token ?? accessToken,
            },
          }
        );

        if (igData.instagram_business_account) {
          // 3. Get the username
          const { data: igProfile } = await axios.get(
            `${GRAPH_API}/${igData.instagram_business_account.id}`,
            {
              params: {
                fields: 'username',
                access_token: page.access_token ?? accessToken,
              },
            }
          );

          return {
            ig_account_id: igData.instagram_business_account.id,
            username: igProfile.username,
            page_id: page.id,
          };
        }
      } catch (error: any) {
        console.error(`[InstagramService] Failed to get IG account for page ${page.id}:`, error.response?.data || error.message);
        continue;
      }
    }

    return null;
  },

  /**
   * Get full Instagram profile.
   * API: GET /{ig-user-id}?fields=...
   */
  async getProfile(accessToken: string, igAccountId: string): Promise<InstagramProfile> {
    const { data } = await axios.get(`${GRAPH_API}/${igAccountId}`, {
      params: {
        fields: [
          'id', 'username', 'name', 'biography',
          'followers_count', 'follows_count', 'media_count',
          'profile_picture_url', 'website', 'account_type',
        ].join(','),
        access_token: accessToken,
      },
    });

    return {
      platform: 'instagram',
      id: data.id,
      username: data.username,
      name: data.name ?? data.username,
      biography: data.biography ?? null,
      followers_count: data.followers_count ?? 0,
      follows_count: data.follows_count ?? 0,
      media_count: data.media_count ?? 0,
      profile_picture_url: data.profile_picture_url ?? null,
      website: data.website ?? null,
      account_type: data.account_type ?? 'PERSONAL',
    };
  },

  /**
   * Get account-level insights (impressions, reach, profile views).
   * API: GET /{ig-user-id}/insights
   * Note: Requires instagram_manage_insights permission.
   */
  async getAccountInsights(
    accessToken: string,
    igAccountId: string,
    period: 'day' | 'week' | 'month' = 'month'
  ): Promise<InstagramInsights> {
    try {
      const { data } = await axios.get(`${GRAPH_API}/${igAccountId}/insights`, {
        params: {
          metric: 'impressions,reach,profile_views,follower_count,accounts_engaged',
          period,
          access_token: accessToken,
        },
      });

      const metrics: Record<string, number> = {};
      for (const item of data.data ?? []) {
        // Get the last value in the series
        const lastValue = item.values?.[item.values.length - 1]?.value ?? 0;
        metrics[item.name] = lastValue;
      }

      return {
        impressions: metrics.impressions ?? 0,
        reach: metrics.reach ?? 0,
        profile_views: metrics.profile_views ?? 0,
        follower_count: metrics.follower_count ?? 0,
        accounts_engaged: metrics.accounts_engaged ?? 0,
      };
    } catch (error: any) {
      console.error(`[InstagramService] Failed to fetch account insights for ${igAccountId}:`, error.response?.data || error.message);
      // Insights require business/creator account — return zeros if unavailable
      return {
        impressions: 0,
        reach: 0,
        profile_views: 0,
        follower_count: 0,
        accounts_engaged: 0,
      };
    }
  },

  /**
   * Get media (posts/reels) with engagement metrics.
   * API: GET /{ig-user-id}/media
   */
  async getMedia(
    accessToken: string,
    igAccountId: string,
    limit = 20
  ): Promise<InstagramMedia[]> {
    const { data } = await axios.get(`${GRAPH_API}/${igAccountId}/media`, {
      params: {
        fields: [
          'id', 'caption', 'media_type', 'media_url',
          'permalink', 'timestamp', 'like_count', 'comments_count',
        ].join(','),
        limit,
        access_token: accessToken,
      },
    });

    const mediaItems: InstagramMedia[] = data.data ?? [];

    // Fetch insights for each post
    const withInsights = await Promise.allSettled(
      mediaItems.map(async (item) => {
        try {
          const insights = await InstagramService.getPostInsights(
            accessToken,
            item.id,
            item.media_type
          );
          return { ...item, insights };
        } catch (error: any) {
          console.error(`[InstagramService] Failed to fetch post insights for media ${item.id}:`, error.response?.data || error.message);
          return item;
        }
      })
    );

    return withInsights
      .filter((r) => r.status === 'fulfilled')
      .map((r) => (r as PromiseFulfilledResult<InstagramMedia>).value);
  },

  /**
   * Get insights for a specific post/reel.
   * Different media types support different metrics.
   */
  async getPostInsights(
    accessToken: string,
    mediaId: string,
    mediaType: string
  ): Promise<{ impressions: number; reach: number; plays?: number; saved?: number; shares?: number }> {
    // Metric list depends on media type
    const metrics =
      mediaType === 'VIDEO' || mediaType === 'REEL'
        ? 'impressions,reach,plays,saved,shares'
        : 'impressions,reach,saved,shares';

    const { data } = await axios.get(`${GRAPH_API}/${mediaId}/insights`, {
      params: {
        metric: metrics,
        access_token: accessToken,
      },
    });

    const result: Record<string, number> = {};
    for (const item of data.data ?? []) {
      result[item.name] = item.values?.[0]?.value ?? 0;
    }

    return {
      impressions: result.impressions ?? 0,
      reach: result.reach ?? 0,
      plays: result.plays,
      saved: result.saved,
      shares: result.shares,
    };
  },

  /**
   * Exchange short-lived token for a long-lived token (60 days).
   * Must be called once right after OAuth callback.
   */
  async exchangeForLongLivedToken(shortLivedToken: string): Promise<{
    access_token: string;
    expires_in: number;
  }> {
    const { data } = await axios.get(`${GRAPH_API}/oauth/access_token`, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        fb_exchange_token: shortLivedToken,
      },
    });

    return {
      access_token: data.access_token,
      expires_in: data.expires_in ?? 5183944, // ~60 days in seconds
    };
  },

  /**
   * Refresh a long-lived token (before it expires).
   */
  async refreshToken(longLivedToken: string): Promise<{
    access_token: string;
    expires_in: number;
  }> {
    const { data } = await axios.get(`${GRAPH_API}/refresh_access_token`, {
      params: {
        grant_type: 'ig_refresh_token',
        access_token: longLivedToken,
      },
    });

    return {
      access_token: data.access_token,
      expires_in: data.expires_in,
    };
  },
};
