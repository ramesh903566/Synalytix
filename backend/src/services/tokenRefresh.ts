import cron from 'node-cron';
import { supabase, decrypt, encrypt } from '../lib/supabase';
import { ConnectionService } from './connectionService';
import { InstagramService } from './instagramService';
import { XService } from './platformServices';

/**
 * Token Refresh Scheduler
 *
 * Runs every hour and refreshes access tokens that are expiring within 24 hours.
 * This prevents users from being suddenly disconnected when their token expires.
 *
 * Platforms that need refresh:
 * - Instagram: tokens last 60 days, need refresh
 * - X: tokens can expire, have refresh_token
 * - LinkedIn: tokens last 60 days, need refresh
 * - GitHub: tokens never expire (unless revoked)
 * - LeetCode: no token
 */
export function startTokenRefreshScheduler() {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('[Cron] Running token refresh check...');

    try {
      // Get all connections expiring within 24 hours
      const expiring = await ConnectionService.getExpiringSoon(24);

      if (expiring.length === 0) {
        console.log('[Cron] No tokens expiring soon.');
        return;
      }

      console.log(`[Cron] Found ${expiring.length} token(s) to refresh.`);

      for (const connection of expiring) {
        try {
          await refreshToken(connection);
        } catch (err: any) {
          console.error(
            `[Cron] Failed to refresh ${connection.platform} token for user ${connection.user_id}:`,
            err.message
          );
        }
      }
    } catch (err: any) {
      console.error('[Cron] Token refresh scheduler error:', err.message);
    }
  });

  console.log('[Cron] Token refresh scheduler started (runs every hour)');
}

async function refreshToken(connection: any) {
  const platform = connection.platform;

  switch (platform) {
    case 'instagram': {
      const currentToken = decrypt(connection.access_token);
      const refreshed = await InstagramService.refreshToken(currentToken);
      const expiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();

      await ConnectionService.updateToken(
        connection.user_id,
        'instagram',
        refreshed.access_token,
        expiresAt
      );

      console.log(`[Cron] Refreshed Instagram token for user ${connection.user_id}`);
      break;
    }

    case 'x': {
      if (!connection.refresh_token) {
        console.log(`[Cron] X connection for user ${connection.user_id} has no refresh token — skipping`);
        break;
      }

      const currentRefreshToken = decrypt(connection.refresh_token);
      const refreshed = await XService.refreshToken(currentRefreshToken);
      const expiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();

      // Update both tokens (X rotates the refresh token too)
      const { error } = await supabase
        .from('platform_connections')
        .update({
          access_token: encrypt(refreshed.access_token),
          refresh_token: encrypt(refreshed.refresh_token),
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', connection.id);

      if (error) throw error;

      console.log(`[Cron] Refreshed X token for user ${connection.user_id}`);
      break;
    }

    case 'linkedin': {
      // LinkedIn doesn't support programmatic token refresh without user interaction
      // We just log a warning — user will need to reconnect
      console.warn(
        `[Cron] LinkedIn token for user ${connection.user_id} is expiring. ` +
        `LinkedIn requires user to re-authorize manually.`
      );
      break;
    }

    default:
      console.log(`[Cron] Platform ${platform} does not need token refresh`);
  }
}
