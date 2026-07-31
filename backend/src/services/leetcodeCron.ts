import cron from 'node-cron';
import { supabase } from '../lib/supabase';
import { LeetCodeService } from './leetcodeService';

/**
 * LeetCode Sync Scheduler
 *
 * Runs every 6 hours to fetch the latest LeetCode stats for all connected users
 * and saves a snapshot in the leetcode_profile_snapshots table.
 */
export function startLeetCodeSyncScheduler() {
  // Run every 6 hours at minute 0
  cron.schedule('0 */6 * * *', async () => {
    console.log('[Cron] Running LeetCode profile sync...');

    try {
      // Get all leetcode connections
      const { data: connections, error } = await supabase
        .from('platform_connections')
        .select('user_id, platform_username')
        .eq('platform', 'leetcode');

      if (error) {
        throw new Error(`Failed to fetch LeetCode connections: ${error.message}`);
      }

      if (!connections || connections.length === 0) {
        console.log('[Cron] No LeetCode connections to sync.');
        return;
      }

      console.log(`[Cron] Found ${connections.length} LeetCode connections to sync.`);

      // Sync sequentially or in small batches to avoid rate limits
      // For now, sequential is safer for LeetCode's undocumented API
      for (const connection of connections) {
        try {
          const profile = await LeetCodeService.getProfile(connection.platform_username);

          const { error: insertError } = await supabase
            .from('leetcode_profile_snapshots')
            .insert({
              user_id: connection.user_id,
              ranking: profile.ranking,
              contest_rating: profile.contest_rating,
              global_ranking: profile.global_ranking,
              easy_solved: profile.easy_solved,
              medium_solved: profile.medium_solved,
              hard_solved: profile.hard_solved,
              acceptance_rate: profile.acceptance_rate,
              reputation: profile.reputation,
              streak: profile.streak,
              activity_summary: profile.activity_summary,
            });

          if (insertError) {
            throw new Error(insertError.message);
          }

          console.log(`[Cron] Synced LeetCode profile for user ${connection.user_id}`);
          
          // Wait 2 seconds between requests to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (err: any) {
          console.error(
            `[Cron] Failed to sync LeetCode profile for user ${connection.user_id}:`,
            err.message
          );
        }
      }
    } catch (err: any) {
      console.error('[Cron] LeetCode sync scheduler error:', err.message);
    }
  });

  console.log('[Cron] LeetCode sync scheduler started (runs every 6 hours)');
}
