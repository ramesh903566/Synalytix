import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { ConnectionService } from '../services/connectionService';
import { GitHubService } from '../services/githubService';
import { InstagramService } from '../services/instagramService';
import { XService, LinkedInService } from '../services/platformServices';
import { LeetCodeService } from '../services/leetcodeService';
import { GoogleCalendarService } from '../services/googleCalendarService';
import { supabase } from '../lib/supabase';

const LeetCodeConnectSchema = z.object({
  username: z.string().min(1).max(50).trim(),
});

const router = Router();

// ─── Helper: get decrypted token or return 404 ────────────────────────────────
async function getConnection(userId: string, platform: string, res: Response) {
  const conn = await ConnectionService.getByUserAndPlatform(userId, platform as any);
  if (!conn) {
    res.status(404).json({
      success: false,
      error: `${platform} is not connected. Please connect it first.`,
    });
    return null;
  }
  return conn;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getToken(conn: { decrypted_access_token: string | null; [k: string]: any }): string {
  if (!conn.decrypted_access_token) {
    throw new Error('No access token available for this connection');
  }
  return conn.decrypted_access_token;
}

// ─── Helper: cache data in Supabase to avoid hammering platform APIs ──────────
async function getCached<T>(
  cacheKey: string,
  ttlMinutes: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  // Check cache
  const { data: cached } = await supabase
    .from('api_cache')
    .select('data, cached_at')
    .eq('cache_key', cacheKey)
    .single();

  if (cached) {
    const age = Date.now() - new Date(cached.cached_at).getTime();
    if (age < ttlMinutes * 60 * 1000) {
      return cached.data as T;
    }
  }

  // Cache miss — fetch fresh data
  const freshData = await fetchFn();

  // Save to cache
  await supabase.from('api_cache').upsert({
    cache_key: cacheKey,
    data: freshData,
    cached_at: new Date().toISOString(),
  }, { onConflict: 'cache_key' });

  return freshData;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GITHUB ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/data/github/profile
router.get('/github/profile', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'github', res);
  if (!conn) return;

  try {
    const data = await getCached(
      `github_profile_${req.userId}`,
      30, // cache for 30 minutes
      () => GitHubService.getProfile(getToken(conn))
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/github/repos
router.get('/github/repos', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'github', res);
  if (!conn) return;

  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.per_page as string) || 30;

  try {
    const data = await getCached(
      `github_repos_${req.userId}_p${page}`,
      30,
      () => GitHubService.getRepos(getToken(conn), page, perPage)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/github/contributions
router.get('/github/contributions', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'github', res);
  if (!conn) return;

  try {
    const data = await getCached(
      `github_contributions_${req.userId}`,
      60, // contributions change less often
      () => GitHubService.getContributions(getToken(conn), conn.platform_username)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/github/languages
router.get('/github/languages', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'github', res);
  if (!conn) return;

  try {
    const repos = await GitHubService.getRepos(getToken(conn));
    const data = await getCached(
      `github_languages_${req.userId}`,
      120,
      () => GitHubService.getLanguageBreakdown(getToken(conn), repos)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/github/all  — single endpoint that returns everything
router.get('/github/all', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'github', res);
  if (!conn) return;

  try {
    const [profile, repos, contributions] = await Promise.all([
      getCached(`github_profile_${req.userId}`, 30, () =>
        GitHubService.getProfile(getToken(conn))
      ),
      GitHubService.getAllRepos(getToken(conn)),
      getCached(`github_contributions_${req.userId}`, 60, () =>
        GitHubService.getContributions(getToken(conn), conn.platform_username)
      ),
    ]);

    const stats = {
      total_stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      fetched_at: new Date().toISOString(),
    };

    res.json({ success: true, data: { profile, repos, contributions, stats } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  INSTAGRAM ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/data/instagram/profile
router.get('/instagram/profile', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'instagram', res);
  if (!conn) return;

  try {
    const data = await getCached(
      `ig_profile_${req.userId}`,
      30,
      () => InstagramService.getProfile(getToken(conn), conn.platform_user_id)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/instagram/insights?period=month
router.get('/instagram/insights', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'instagram', res);
  if (!conn) return;

  const period = (req.query.period as 'day' | 'week' | 'month') || 'month';

  try {
    const data = await getCached(
      `ig_insights_${req.userId}_${period}`,
      60,
      () => InstagramService.getAccountInsights(
        getToken(conn),
        conn.platform_user_id,
        period
      )
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/instagram/media?limit=20
router.get('/instagram/media', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'instagram', res);
  if (!conn) return;

  const limit = parseInt(req.query.limit as string) || 20;

  try {
    const data = await getCached(
      `ig_media_${req.userId}_${limit}`,
      30,
      () => InstagramService.getMedia(
        getToken(conn),
        conn.platform_user_id,
        limit
      )
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/instagram/all  — everything in one call
router.get('/instagram/all', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'instagram', res);
  if (!conn) return;

  try {
    const [profile, insights, media] = await Promise.all([
      getCached(`ig_profile_${req.userId}`, 30, () =>
        InstagramService.getProfile(getToken(conn), conn.platform_user_id)
      ),
      getCached(`ig_insights_${req.userId}_month`, 60, () =>
        InstagramService.getAccountInsights(
          getToken(conn),
          conn.platform_user_id,
          'month'
        )
      ),
      getCached(`ig_media_${req.userId}_20`, 30, () =>
        InstagramService.getMedia(getToken(conn), conn.platform_user_id, 20)
      ),
    ]);

    res.json({ success: true, data: { profile, insights, media } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  X (TWITTER) ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/data/x/profile
router.get('/x/profile', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'x', res);
  if (!conn) return;

  try {
    const data = await getCached(
      `x_profile_${req.userId}`,
      30,
      () => XService.getProfile(getToken(conn))
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/x/tweets?limit=10
router.get('/x/tweets', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'x', res);
  if (!conn) return;

  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const data = await getCached(
      `x_tweets_${req.userId}_${limit}`,
      30,
      () => XService.getRecentTweets(getToken(conn), conn.platform_user_id, limit)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/x/all
router.get('/x/all', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'x', res);
  if (!conn) return;

  try {
    const [profile, tweets] = await Promise.all([
      getCached(`x_profile_${req.userId}`, 30, () =>
        XService.getProfile(getToken(conn))
      ),
      getCached(`x_tweets_${req.userId}_10`, 30, () =>
        XService.getRecentTweets(getToken(conn), conn.platform_user_id, 10)
      ),
    ]);

    res.json({ success: true, data: { profile, tweets } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  LINKEDIN ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/data/linkedin/profile
router.get('/linkedin/profile', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'linkedin', res);
  if (!conn) return;

  try {
    const data = await getCached(
      `li_profile_${req.userId}`,
      60,
      () => LinkedInService.getProfile(getToken(conn))
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/linkedin/posts
router.get('/linkedin/posts', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'linkedin', res);
  if (!conn) return;

  try {
    const data = await getCached(
      `li_posts_${req.userId}`,
      60,
      () => LinkedInService.getPostAnalytics(getToken(conn), conn.platform_user_id)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/linkedin/all
router.get('/linkedin/all', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'linkedin', res);
  if (!conn) return;

  try {
    const [profile, posts] = await Promise.all([
      getCached(`li_profile_${req.userId}`, 60, () =>
        LinkedInService.getProfile(getToken(conn))
      ),
      getCached(`li_posts_${req.userId}`, 60, () =>
        LinkedInService.getPostAnalytics(getToken(conn), conn.platform_user_id)
      ),
    ]);

    res.json({ success: true, data: { profile, posts } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  LEETCODE ROUTES
//  No OAuth — just username. We store username in platform_connections table.
// ═══════════════════════════════════════════════════════════════════════════════

// POST /api/data/leetcode/connect  — user submits their username
router.post('/leetcode/connect', authenticate, async (req: Request, res: Response) => {
  const parsed = LeetCodeConnectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.issues[0].message });
    return;
  }

  const cleanUsername = parsed.data.username;

  try {
    // 1. Validate the username exists on LeetCode
    const isValid = await LeetCodeService.validateUsername(cleanUsername);
    if (!isValid) {
      res.status(404).json({
        success: false,
        error: `LeetCode user "${cleanUsername}" not found or profile is private`,
      });
      return;
    }

    // 2. Fetch their profile to store initial data
    const profile = await LeetCodeService.getProfile(cleanUsername);

    // 3. Save to platform_connections
    await ConnectionService.upsert({
      user_id: req.userId!,
      platform: 'leetcode',
      access_token: null, // No token needed for LeetCode
      refresh_token: null,
      expires_at: null,
      platform_user_id: cleanUsername,
      platform_username: cleanUsername,
      scope: null,
    });
    
    // 4. Save initial snapshot
    await supabase.from('leetcode_profile_snapshots').insert({
      user_id: req.userId!,
      ranking: profile.ranking,
      contest_rating: profile.contest_rating,
      global_ranking: profile.global_ranking,
      easy_solved: profile.easy_solved,
      medium_solved: profile.medium_solved,
      hard_solved: profile.hard_solved,
      acceptance_rate: profile.acceptance_rate,
      reputation: profile.reputation,
      streak: profile.streak,
      activity_summary: profile.activity_summary
    });

    res.json({
      success: true,
      message: `LeetCode account @${cleanUsername} connected successfully`,
      data: profile,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/leetcode/stats
router.get('/leetcode/stats', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'leetcode', res);
  if (!conn) return;

  const username = conn.platform_username;

  try {
    const data = await getCached(
      `lc_profile_${username}`,
      60,
      () => LeetCodeService.getProfile(username)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/leetcode/submissions
router.get('/leetcode/submissions', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'leetcode', res);
  if (!conn) return;

  const limit = parseInt(req.query.limit as string) || 15;
  const username = conn.platform_username;

  try {
    const data = await getCached(
      `lc_submissions_${username}_${limit}`,
      30,
      () => LeetCodeService.getRecentSubmissions(username, limit)
    );
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/leetcode/all
router.get('/leetcode/all', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'leetcode', res);
  if (!conn) return;

  const username = conn.platform_username;

  try {
    const [profile, submissions] = await Promise.all([
      getCached(`lc_profile_${username}`, 60, () => LeetCodeService.getProfile(username)),
      getCached(`lc_submissions_${username}_15`, 30, () =>
        LeetCodeService.getRecentSubmissions(username, 15)
      ),
    ]);

    const stats = {
      leetcode_username: username,
      total_solved: (profile.easy_solved || 0) + (profile.medium_solved || 0) + (profile.hard_solved || 0),
      easy_solved: profile.easy_solved || 0,
      medium_solved: profile.medium_solved || 0,
      hard_solved: profile.hard_solved || 0,
      acceptance_rate: profile.acceptance_rate || 0,
      ranking: profile.ranking || 0,
      reputation: profile.reputation || 0,
      timestamp: new Date().toISOString()
    };

    res.json({ success: true, data: { stats, submissions } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/data/leetcode/sync
router.post('/leetcode/sync', authenticate, async (req: Request, res: Response) => {
  const conn = await getConnection(req.userId!, 'leetcode', res);
  if (!conn) return;

  const username = conn.platform_username;
  
  // Rate limit: check if last snapshot was within 15 minutes
  const { data: lastSnapshot } = await supabase
    .from('leetcode_profile_snapshots')
    .select('timestamp')
    .eq('user_id', req.userId!)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single();
    
  if (lastSnapshot) {
    const age = Date.now() - new Date(lastSnapshot.timestamp).getTime();
    if (age < 15 * 60 * 1000) {
      res.status(429).json({ success: false, error: 'Manual sync is rate limited to once per 15 minutes.' });
      return;
    }
  }

  try {
    const profile = await LeetCodeService.getProfile(username);
    
    // Save new snapshot
    await supabase.from('leetcode_profile_snapshots').insert({
      user_id: req.userId!,
      ranking: profile.ranking,
      contest_rating: profile.contest_rating,
      global_ranking: profile.global_ranking,
      easy_solved: profile.easy_solved,
      medium_solved: profile.medium_solved,
      hard_solved: profile.hard_solved,
      acceptance_rate: profile.acceptance_rate,
      reputation: profile.reputation,
      streak: profile.streak,
      activity_summary: profile.activity_summary
    });

    res.json({ success: true, data: profile });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  DASHBOARD SUMMARY ROUTE
//  Single endpoint that returns a summary across ALL connected platforms.
//  Frontend calls this once to populate the main dashboard.
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/summary', authenticate, async (req: Request, res: Response) => {
  const userId = req.userId!;

  try {
    // Get all connected platforms for this user
    const connections = await ConnectionService.getAllForUser(userId);
    const connectedPlatforms = connections.map(c => c.platform);

    const summary: Record<string, any> = {
      connected_platforms: connectedPlatforms,
      fetched_at: new Date().toISOString(),
    };

    // Fetch data for each connected platform in parallel
    const fetches = connectedPlatforms.map(async (platform) => {
      try {
        const conn = await ConnectionService.getByUserAndPlatform(userId, platform);
        if (!conn) return;

        switch (platform) {
          case 'github':
            summary.github = await getCached(`github_profile_${userId}`, 30, () =>
              GitHubService.getProfile(getToken(conn))
            );
            break;

          case 'instagram':
            const [igProfile, igInsights] = await Promise.all([
              getCached(`ig_profile_${userId}`, 30, () =>
                InstagramService.getProfile(getToken(conn), conn.platform_user_id)
              ),
              getCached(`ig_insights_${userId}_month`, 60, () =>
                InstagramService.getAccountInsights(
                  getToken(conn),
                  conn.platform_user_id,
                  'month'
                )
              ),
            ]);
            summary.instagram = { ...igProfile, insights: igInsights };
            break;

          case 'x':
            summary.x = await getCached(`x_profile_${userId}`, 30, () =>
              XService.getProfile(getToken(conn))
            );
            break;

          case 'linkedin':
            summary.linkedin = await getCached(`li_profile_${userId}`, 60, () =>
              LinkedInService.getProfile(getToken(conn))
            );
            break;

          case 'leetcode':
            summary.leetcode = await getCached(`lc_stats_${conn.platform_username}`, 60, () =>
              LeetCodeService.getProfile(conn.platform_username)
            );
            break;
        }
      } catch (err: any) {
        // Don't fail the whole summary if one platform errors
        summary[platform] = { error: err.message };
      }
    });

    await Promise.all(fetches);

    res.json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/data/google-calendar/events
// ═══════════════════════════════════════════════════════════════════════════════
router.get('/google-calendar/events', authenticate, async (req: Request, res: Response) => {
  const userId = req.userId!;
  try {
    const conn = await getConnection(userId, 'google-calendar', res);
    if (!conn) return;

    if (!conn.access_token) {
      res.status(401).json({ success: false, error: 'Google Calendar access token is missing' });
      return;
    }

    const events = await GoogleCalendarService.getEvents(conn.access_token, conn.refresh_token);

    // Normalize events for frontend
    const normalizedEvents = events.map(event => {
      const isAllDay = !!event.start?.date;
      const startStr = event.start?.dateTime || event.start?.date || '';
      
      let date = '';
      let time = undefined;
      
      if (startStr) {
        const d = new Date(startStr);
        // Format YYYY-MM-DD local time
        date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        
        if (!isAllDay) {
          time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
      }

      return {
        id: event.id,
        title: event.summary || '(No title)',
        date,
        time,
        category: 'google-event', // Used for rendering later
        status: 'todo', // By default not done
        color: '#4285F4', // Google Blue
      };
    }).filter(e => e.date); // Filter out events without a date

    res.json({ success: true, data: normalizedEvents });
  } catch (err: any) {
    console.error('[Google Calendar API Error]:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch calendar events' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
//  CACHE INVALIDATION
//  Force fresh data for a user's platform (POST to clear cache)
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/cache/invalidate/:platform', authenticate, async (req: Request, res: Response) => {
  const platform = req.params.platform;
  const userId = req.userId!;

  try {
    // Delete all cache entries for this user + platform
    await supabase
      .from('api_cache')
      .delete()
      .like('cache_key', `${platform}_%_${userId}%`);

    res.json({ success: true, message: `Cache cleared for ${platform}` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
