import { Router, Request, Response } from 'express';
import axios from 'axios';
import { authenticate } from '../middleware/auth';
import { ConnectionService, OAuthStateService } from '../services/connectionService';
import { InstagramService } from '../services/instagramService';
import { XService, LinkedInService } from '../services/platformServices';
import { generateState, generateCodeVerifier, generateCodeChallenge } from '../lib/supabase';
import { Platform } from '../types';
import { GoogleCalendarService } from '../services/googleCalendarService';

const router = Router();

const BACKEND_URL = process.env.BACKEND_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

if (!BACKEND_URL || !FRONTEND_URL) {
  console.warn('[Auth] BACKEND_URL and FRONTEND_URL env vars are required for OAuth redirects');
}

function wantsJson(req: Request) {
  return req.get('accept')?.includes('application/json') || req.query.format === 'json';
}

function requireEnv(platform: string, names: string[]): boolean {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    console.warn(`[OAuth Connect] ${platform} missing env vars: ${missing.join(', ')}`);
    return false;
  }
  return true;
}

function failConnect(res: Response, platform: string, message: string) {
  res.status(500).json({
    success: false,
    error: `${platform} OAuth is not configured: ${message}`,
  });
}

// ─── Helper: redirect to frontend with error ──────────────────────────────────
function redirectWithError(res: Response, platform: string, message: string) {
  const url = new URL(`${FRONTEND_URL}/app/apps`);
  url.searchParams.set('error', message);
  url.searchParams.set('platform', platform);
  res.redirect(url.toString());
}

function redirectWithSuccess(res: Response, platform: string) {
  if (platform === 'google-calendar') {
    const url = new URL(`${FRONTEND_URL}/app/settings`);
    url.searchParams.set('tab', 'calendars');
    url.searchParams.set('connected', 'true');
    res.redirect(url.toString());
    return;
  }
  const url = new URL(`${FRONTEND_URL}/app/apps/${platform}`);
  url.searchParams.set('connected', 'true');
  res.redirect(url.toString());
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/auth/connect/:platform
// Called by frontend when user clicks "Connect" on any platform.
// Builds the OAuth URL and redirects the user to the platform's login page.
// ═══════════════════════════════════════════════════════════════════════════════
router.get('/connect/:platform', authenticate, async (req: Request, res: Response) => {
  const platform = req.params.platform as Platform;
  const userId = req.userId!;

  const validPlatforms: Platform[] = ['github', 'instagram', 'x', 'linkedin', 'google-calendar'];
  if (!validPlatforms.includes(platform)) {
    res.status(400).json({ success: false, error: `Unknown platform: ${platform}` });
    return;
  }

  if (!BACKEND_URL || !FRONTEND_URL) {
    failConnect(res, platform, 'BACKEND_URL and FRONTEND_URL must be set');
    return;
  }

  try {
    const stateToken = generateState();
    let authUrl = '';

    if (platform === 'github') {
      if (!requireEnv(platform, ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'])) {
        failConnect(res, platform, 'set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET');
        return;
      }

      // GitHub OAuth 2.0 — simple, no PKCE needed
      await OAuthStateService.save({ user_id: userId, platform, state_token: stateToken });

      const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        redirect_uri: `${BACKEND_URL}/api/auth/callback/github`,
        scope: 'read:user repo',
        state: stateToken,
      });
      authUrl = `https://github.com/login/oauth/authorize?${params}`;

    } else if (platform === 'instagram') {
      if (!requireEnv(platform, ['META_APP_ID', 'META_APP_SECRET'])) {
        failConnect(res, platform, 'set META_APP_ID and META_APP_SECRET');
        return;
      }

      // Meta / Instagram OAuth
      await OAuthStateService.save({ user_id: userId, platform, state_token: stateToken });

      const params = new URLSearchParams({
        client_id: process.env.META_APP_ID!,
        redirect_uri: `${BACKEND_URL}/api/auth/callback/instagram`,
        scope: 'instagram_basic,instagram_content_publish,instagram_manage_insights,pages_show_list,pages_read_engagement,business_management,instagram_manage_comments,pages_manage_metadata',
        response_type: 'code',
        state: stateToken,
      });
      authUrl = `https://www.facebook.com/dialog/oauth?${params}`;

    } else if (platform === 'x') {
      if (!requireEnv(platform, ['X_CLIENT_ID', 'X_CLIENT_SECRET'])) {
        failConnect(res, platform, 'set X_CLIENT_ID and X_CLIENT_SECRET');
        return;
      }

      // X OAuth 2.0 with PKCE (required by X)
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = generateCodeChallenge(codeVerifier);

      await OAuthStateService.save({
        user_id: userId,
        platform,
        state_token: stateToken,
        code_verifier: codeVerifier, // save for callback
      });

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.X_CLIENT_ID!,
        redirect_uri: `${BACKEND_URL}/api/auth/callback/x`,
        scope: 'tweet.read tweet.write users.read offline.access',
        state: stateToken,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      });
      authUrl = `https://twitter.com/i/oauth2/authorize?${params}`;

    } else if (platform === 'linkedin') {
      if (!requireEnv(platform, ['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET'])) {
        failConnect(res, platform, 'set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET');
        return;
      }

      await OAuthStateService.save({ user_id: userId, platform, state_token: stateToken });
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        redirect_uri: `${BACKEND_URL}/api/auth/callback/linkedin`,
        state: stateToken,
        scope: 'openid profile email w_member_social',
      });
      authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
    } else if (platform === 'google-calendar') {
      if (!requireEnv(platform, ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'])) {
        failConnect(res, platform, 'set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET');
        return;
      }

      await OAuthStateService.save({ user_id: userId, platform, state_token: stateToken });
      authUrl = GoogleCalendarService.getAuthUrl(stateToken);
    }

    if (wantsJson(req)) {
      res.json({ success: true, data: { url: authUrl } });
      return;
    }

    res.redirect(authUrl);
  } catch (error: any) {
    console.error(`[OAuth Connect] ${platform} error:`, error.message);
    res.status(500).json({ success: false, error: 'Failed to initiate OAuth flow' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/auth/callback/github
// GitHub redirects here after user approves. We exchange the code for a token.
// ═══════════════════════════════════════════════════════════════════════════════
router.get('/callback/github', async (req: Request, res: Response) => {
  const { code, state, error } = req.query as Record<string, string>;

  if (error) {
    return redirectWithError(res, 'github', 'User denied access to GitHub');
  }

  if (!code || !state) {
    return redirectWithError(res, 'github', 'Missing code or state from GitHub');
  }

  // 1. Verify CSRF state token
  const savedState = await OAuthStateService.getAndDelete(state);
  if (!savedState) {
    return redirectWithError(res, 'github', 'Invalid or expired state token');
  }

  try {
    // 2. Exchange code for access token
    const { data: tokenData } = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${BACKEND_URL}/api/auth/callback/github`,
      },
      { headers: { Accept: 'application/json' } }
    );

    if (tokenData.error) {
      return redirectWithError(res, 'github', tokenData.error_description ?? 'Token exchange failed');
    }

    const accessToken: string = tokenData.access_token;

    // 3. Get GitHub user info to store alongside the token
    const { data: githubUser } = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // 4. Save to database (encrypted)
    await ConnectionService.upsert({
      user_id: savedState.user_id,
      platform: 'github',
      access_token: accessToken,
      refresh_token: null,          // GitHub tokens don't expire
      expires_at: null,
      platform_user_id: githubUser.id.toString(),
      platform_username: githubUser.login,
      scope: tokenData.scope ?? 'read:user,repo',
    });

    console.log(`[OAuth] GitHub connected for user ${savedState.user_id} (@${githubUser.login})`);
    return redirectWithSuccess(res, 'github');

  } catch (err: any) {
    console.error('[OAuth Callback] GitHub error:', err.message);
    return redirectWithError(res, 'github', 'Failed to complete GitHub authorization');
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/auth/callback/instagram
// Meta redirects here. We exchange code, get long-lived token, find IG account.
// ═══════════════════════════════════════════════════════════════════════════════
router.get('/callback/instagram', async (req: Request, res: Response) => {
  const { code, state, error } = req.query as Record<string, string>;

  if (error) {
    return redirectWithError(res, 'instagram', 'User denied access to Instagram');
  }
  if (!code || !state) {
    return redirectWithError(res, 'instagram', 'Missing code or state from Meta');
  }

  const savedState = await OAuthStateService.getAndDelete(state);
  if (!savedState) {
    return redirectWithError(res, 'instagram', 'Invalid or expired state token');
  }

  try {
    // 1. Exchange code for short-lived token
    const tokenParams = new URLSearchParams({
      client_id: process.env.META_APP_ID!,
      client_secret: process.env.META_APP_SECRET!,
      redirect_uri: `${BACKEND_URL}/api/auth/callback/instagram`,
      code,
    });

    const { data: tokenData } = await axios.post(
      'https://graph.facebook.com/v19.0/oauth/access_token',
      tokenParams.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const shortLivedToken: string = tokenData.access_token;

    // 2. Exchange for long-lived token (valid 60 days)
    const longLived = await InstagramService.exchangeForLongLivedToken(shortLivedToken);
    const accessToken = longLived.access_token;
    const expiresAt = new Date(Date.now() + longLived.expires_in * 1000).toISOString();

    // 3. Find the user's Instagram Business Account
    const igAccount = await InstagramService.getInstagramAccountId(accessToken);
    if (!igAccount) {
      return redirectWithError(
        res,
        'instagram',
        'No Instagram Business/Creator account found. Please ensure your Instagram is a Professional account connected to a Facebook Page.'
      );
    }

    // 4. Get basic profile for display
    const igProfile = await InstagramService.getProfile(accessToken, igAccount.ig_account_id);

    // 5. Save to database
    await ConnectionService.upsert({
      user_id: savedState.user_id,
      platform: 'instagram',
      access_token: accessToken,
      refresh_token: null,
      expires_at: expiresAt,
      platform_user_id: igAccount.ig_account_id,
      platform_username: igProfile.username,
      scope: 'instagram_basic,instagram_content_publish,instagram_manage_insights,pages_show_list,pages_read_engagement,business_management,instagram_manage_comments,pages_manage_metadata',
    });

    console.log(`[OAuth] Instagram connected: @${igProfile.username}`);
    return redirectWithSuccess(res, 'instagram');

  } catch (err: any) {
    console.error('[OAuth Callback] Instagram error:', err.response?.data ?? err.message);
    return redirectWithError(res, 'instagram', 'Failed to complete Instagram authorization');
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/auth/callback/x
// X redirects here. We use PKCE code verifier to exchange the code.
// ═══════════════════════════════════════════════════════════════════════════════
router.get('/callback/x', async (req: Request, res: Response) => {
  const { code, state, error } = req.query as Record<string, string>;

  if (error) {
    return redirectWithError(res, 'x', 'User denied access to X');
  }
  if (!code || !state) {
    return redirectWithError(res, 'x', 'Missing code or state from X');
  }

  const savedState = await OAuthStateService.getAndDelete(state);
  if (!savedState || !savedState.code_verifier) {
    return redirectWithError(res, 'x', 'Invalid state or missing PKCE verifier');
  }

  try {
    // 1. Exchange code for tokens (using PKCE verifier)
    const tokens = await XService.exchangeCodeForToken({
      code,
      redirectUri: `${BACKEND_URL}/api/auth/callback/x`,
      codeVerifier: savedState.code_verifier,
    });

    // 2. Get X user profile
    const profile = await XService.getProfile(tokens.access_token);

    // 3. Calculate expiry
    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null;

    // 4. Save to database
    await ConnectionService.upsert({
      user_id: savedState.user_id,
      platform: 'x',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token ?? null,
      expires_at: expiresAt,
      platform_user_id: profile.id,
      platform_username: profile.username,
      scope: 'tweet.read tweet.write users.read offline.access',
    });

    console.log(`[OAuth] X connected: @${profile.username}`);
    return redirectWithSuccess(res, 'x');

  } catch (err: any) {
    console.error('[OAuth Callback] X error:', err.response?.data ?? err.message);
    return redirectWithError(res, 'x', 'Failed to complete X authorization');
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/auth/callback/linkedin
// LinkedIn redirects here after user approves.
// ═══════════════════════════════════════════════════════════════════════════════
router.get('/callback/linkedin', async (req: Request, res: Response) => {
  const { code, state, error } = req.query as Record<string, string>;

  if (error) {
    return redirectWithError(res, 'linkedin', 'User denied access to LinkedIn');
  }
  if (!code || !state) {
    return redirectWithError(res, 'linkedin', 'Missing code or state from LinkedIn');
  }

  const savedState = await OAuthStateService.getAndDelete(state);
  if (!savedState) {
    return redirectWithError(res, 'linkedin', 'Invalid or expired state token');
  }

  try {
    // 1. Exchange code for token
    const tokens = await LinkedInService.exchangeCodeForToken(
      code,
      `${BACKEND_URL}/api/auth/callback/linkedin`
    );

    // 2. Get LinkedIn profile
    const profile = await LinkedInService.getProfile(tokens.access_token);

    // 3. Calculate expiry (LinkedIn tokens last ~60 days)
    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null;

    // 4. Save to database
    await ConnectionService.upsert({
      user_id: savedState.user_id,
      platform: 'linkedin',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token ?? null,
      expires_at: expiresAt,
      platform_user_id: profile.id,
      platform_username: `${profile.first_name} ${profile.last_name}`,
      scope: 'openid profile email',
    });

    console.log(`[OAuth] LinkedIn connected: ${profile.first_name} ${profile.last_name}`);
    return redirectWithSuccess(res, 'linkedin');

  } catch (err: any) {
    console.error('[OAuth Callback] LinkedIn error:', err.response?.data ?? err.message);
    return redirectWithError(res, 'linkedin', 'Failed to complete LinkedIn authorization');
  }
});
// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/auth/callback/google-calendar
// Google redirects here after user approves Calendar access.
// ═══════════════════════════════════════════════════════════════════════════════
router.get('/callback/google-calendar', async (req: Request, res: Response) => {
  const { code, state, error } = req.query as Record<string, string>;

  if (error) {
    return redirectWithError(res, 'google-calendar', 'User denied access to Google Calendar');
  }

  if (!code || !state) {
    return redirectWithError(res, 'google-calendar', 'Missing code or state from Google');
  }

  const savedState = await OAuthStateService.getAndDelete(state);
  if (!savedState) {
    return redirectWithError(res, 'google-calendar', 'Invalid or expired state token');
  }

  try {
    const tokens = await GoogleCalendarService.getTokens(code);
    
    // For Google Calendar, we might not have a specific "username", so we just use their email if available in id_token or generic string
    // Let's use a generic username since we didn't ask for profile scope, just calendar
    const platformUserId = 'google_user_' + savedState.user_id; 
    const platformUsername = 'Google Calendar';

    await ConnectionService.upsert({
      user_id: savedState.user_id,
      platform: 'google-calendar',
      access_token: tokens.access_token || null,
      refresh_token: tokens.refresh_token || null,
      expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
      platform_user_id: platformUserId,
      platform_username: platformUsername,
      scope: tokens.scope || 'https://www.googleapis.com/auth/calendar.readonly',
    });

    redirectWithSuccess(res, 'google-calendar');
  } catch (err: any) {
    console.error('[OAuth Callback] Google Calendar error:', err.message);
    redirectWithError(res, 'google-calendar', 'Failed to exchange token with Google');
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// DELETE /api/auth/disconnect/:platform
// User wants to disconnect a platform — removes token from DB.
// ═══════════════════════════════════════════════════════════════════════════════
router.delete('/disconnect/:platform', authenticate, async (req: Request, res: Response) => {
  const platform = req.params.platform as Platform;
  const userId = req.userId!;

  try {
    await ConnectionService.delete(userId, platform);
    res.json({ success: true, message: `${platform} disconnected successfully` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/auth/status
// Returns which platforms the current user has connected.
// Frontend calls this on load to know which apps are connected.
// ═══════════════════════════════════════════════════════════════════════════════
router.get('/status', authenticate, async (req: Request, res: Response) => {
  const userId = req.userId!;

  try {
    const connections = await ConnectionService.getAllForUser(userId);
    res.json({
      success: true,
      data: {
        connected: connections.map(c => c.platform),
        connections: connections.map(c => ({
          platform: c.platform,
          username: c.platform_username,
          connected_at: c.created_at,
          expires_at: c.expires_at,
        })),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
