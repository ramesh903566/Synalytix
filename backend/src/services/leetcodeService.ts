import { redis } from '../lib/redis';
import { logger } from '../lib/logger';
import { z } from 'zod';
import { LeetCodeProfileSnapshot } from '../types';

// Zod schemas for validation
const LeetCodeGqlResponseSchema = z.object({
  data: z.object({
    matchedUser: z.object({
      username: z.string(),
      submitStats: z.object({
        acSubmissionNum: z.array(z.object({
          difficulty: z.string(),
          count: z.number(),
        })),
      }),
      profile: z.object({
        ranking: z.number().nullable(),
        reputation: z.number(),
      }),
      userCalendar: z.object({
        streak: z.number(),
        totalActiveDays: z.number(),
        submissionCalendar: z.string(), // JSON string
      }),
    }).nullable(),
    userContestRanking: z.object({
      rating: z.number().nullable(),
      globalRanking: z.number().nullable(),
    }).nullable(),
  })
});

const CACHE_TTL_SECONDS = 6 * 60 * 60; // 6 hours

export const LeetCodeService = {
  /**
   * Fetches public profile data for a LeetCode user.
   */
  async getProfile(username: string): Promise<Partial<LeetCodeProfileSnapshot>> {
    const cacheKey = `leetcode_profile_${username}`;
    
    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
          profile {
            ranking
            reputation
          }
          userCalendar {
            streak
            totalActiveDays
            submissionCalendar
          }
        }
        userContestRanking(username: $username) {
          rating
          globalRanking
        }
      }
    `;

    let attempt = 0;
    const maxRetries = 3;

    while (attempt < maxRetries) {
      try {
        const response = await fetch('https://leetcode.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'SynalytixBot/1.0',
          },
          body: JSON.stringify({
            query,
            variables: { username }
          })
        });

        if (response.status === 429) {
          throw new Error('Rate limited');
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Handle private or missing profile
        const rawData = await response.json() as { errors?: Array<{ message: string }>; data?: unknown };
        
        if (rawData.errors && rawData.errors.length > 0) {
           throw new Error(rawData.errors[0].message);
        }

        const parsed = LeetCodeGqlResponseSchema.parse(rawData);

        if (!parsed.data.matchedUser) {
           throw new Error('User not found or profile is private');
        }

        const stats = parsed.data.matchedUser.submitStats.acSubmissionNum;
        const easy = stats.find(s => s.difficulty === 'Easy')?.count ?? 0;
        const medium = stats.find(s => s.difficulty === 'Medium')?.count ?? 0;
        const hard = stats.find(s => s.difficulty === 'Hard')?.count ?? 0;
        const all = stats.find(s => s.difficulty === 'All')?.count ?? 0;
        
        let activitySummary = null;
        try {
           activitySummary = JSON.parse(parsed.data.matchedUser.userCalendar.submissionCalendar);
        } catch (e) {
           logger.warn('Failed to parse LeetCode submissionCalendar', { username });
        }

        const snapshot: Partial<LeetCodeProfileSnapshot> = {
          ranking: parsed.data.matchedUser.profile.ranking,
          contest_rating: parsed.data.userContestRanking?.rating ?? null,
          global_ranking: parsed.data.userContestRanking?.globalRanking ?? null,
          easy_solved: easy,
          medium_solved: medium,
          hard_solved: hard,
          acceptance_rate: null, // Note: Global acceptance rate isn't directly in this simple query, usually needs full stat query
          reputation: parsed.data.matchedUser.profile.reputation,
          streak: parsed.data.matchedUser.userCalendar.streak,
          activity_summary: activitySummary
        };

        await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(snapshot));
        return snapshot;

      } catch (err: any) {
        if (err.message === 'Rate limited' && attempt < maxRetries - 1) {
          const backoff = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, backoff));
          attempt++;
        } else {
          logger.error('Failed to fetch LeetCode profile', { username, error: err.message });
          throw err;
        }
      }
    }
    
    throw new Error('Max retries exceeded');
  },

  /**
   * Get a user's recent submission history.
   */
  async getRecentSubmissions(username: string, limit = 15): Promise<any[]> {
    const query = `
      query getRecentSubmissions($username: String!, $limit: Int!) {
        recentSubmissionList(username: $username, limit: $limit) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SynalytixBot/1.0',
      },
      body: JSON.stringify({ query, variables: { username, limit } })
    });
    
    if (!response.ok) return [];
    
    const data = await response.json() as { data?: { recentSubmissionList?: Array<Record<string, unknown>> } };
    const submissions = data?.data?.recentSubmissionList ?? [];

    return submissions.map((s: any) => ({
      title: s.title,
      title_slug: s.titleSlug,
      timestamp: new Date(parseInt(s.timestamp) * 1000).toISOString(),
      status_display: s.statusDisplay,
      lang: s.lang,
    }));
  },

  /**
   * Validate that a LeetCode username exists.
   */
  async validateUsername(username: string): Promise<boolean> {
    try {
      await this.getProfile(username);
      return true;
    } catch {
      return false;
    }
  }
};
