import { supabase } from '../lib/supabase';
import { ConnectionService } from './connectionService';
import { GitHubService } from './githubService';

export class GithubSyncService {
  /**
   * Fetches the latest data from GitHub for a user and syncs it to the Supabase database.
   * Generates basic AI insights and a portfolio score based on the raw data.
   */
  static async syncUser(userId: string): Promise<void> {
    try {
      console.log(`[GithubSyncService] Starting sync for user ${userId}`);
      
      const conn = await ConnectionService.getByUserAndPlatform(userId, 'github');
      if (!conn || !conn.decrypted_access_token) {
        console.warn(`[GithubSyncService] No GitHub connection or token found for user ${userId}`);
        return;
      }

      const token = conn.decrypted_access_token;
      const username = conn.platform_username;

      // 1. Fetch data from GitHub APIs
      const [profile, repos, contributions] = await Promise.all([
        GitHubService.getProfile(token),
        GitHubService.getAllRepos(token),
        GitHubService.getContributions(token, username)
      ]);

      const languageBreakdown = await GitHubService.getLanguageBreakdown(token, repos);

      // 2. Save Profile
      await supabase.from('github_profiles').upsert({
        user_id: userId,
        username: profile.username,
        name: profile.name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        followers: profile.followers,
        following: profile.following,
        public_repos: profile.public_repos,
        synced_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

      // 3. Save Repositories
      const repoRows = repos.map(repo => ({
        user_id: userId,
        repo_id: repo.id.toString(),
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        is_private: repo.is_private,
        updated_at: repo.updated_at,
        synced_at: new Date().toISOString()
      }));

      if (repoRows.length > 0) {
        await supabase.from('github_repositories').upsert(repoRows, { onConflict: 'user_id,repo_id' });
      }

      // 4. Save Activity Events (Clear first to avoid infinite growth from simple insert)
      await supabase.from('github_activity_events').delete().eq('user_id', userId);
      
      const eventRows = contributions.events.map(event => ({
        user_id: userId,
        type: event.type,
        repo: event.repo,
        created_at: event.created_at,
        synced_at: new Date().toISOString()
      }));

      if (eventRows.length > 0) {
        await supabase.from('github_activity_events').upsert(eventRows, { onConflict: 'user_id,type,repo,created_at' });
      }

      // 5. Save Languages
      const langRows = Object.entries(languageBreakdown).map(([lang, bytes]) => ({
        user_id: userId,
        language: lang,
        bytes: bytes,
        synced_at: new Date().toISOString()
      }));

      if (langRows.length > 0) {
        await supabase.from('github_languages').upsert(langRows, { onConflict: 'user_id,language' });
      }

      // 6. Calculate Insights & Portfolio Score
      let score = 0;
      const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
      const totalForks = repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);
      
      // Basic deterministic scoring formula
      score += Math.min(30, totalStars * 2); 
      score += Math.min(20, totalForks * 3);
      score += Math.min(30, repos.length); // Volume up to 30
      score += Math.min(20, profile.followers * 2); // Followers up to 20
      score = Math.min(100, score); 

      // Generate deterministic recommendations based on thresholds
      const insights = [];
      if (repos.length < 5) {
        insights.push("Create more repositories to show your activity.");
      }
      if (totalStars === 0) {
        insights.push("Try contributing to open source or sharing your projects to gain stars.");
      }
      if (!profile.bio) {
        insights.push("Add a bio to your GitHub profile to improve your discoverability.");
      }
      
      const dominantLanguage = langRows.sort((a, b) => b.bytes - a.bytes)[0]?.language;
      if (dominantLanguage) {
        insights.push(`Your strongest language is ${dominantLanguage}. Consider pinning repos in this language.`);
      }
      
      if (contributions.recent_pull_requests === 0) {
        insights.push("Low collaboration score. Increase pull request participation.");
      }
      
      if (score > 80) {
        insights.push("Excellent consistency across your portfolio.");
      }

      await supabase.from('github_insights').upsert({
        user_id: userId,
        portfolio_score: score,
        insights_json: insights,
        synced_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

      console.log(`[GithubSyncService] Sync completed for user ${userId}`);
    } catch (error: any) {
      console.error(`[GithubSyncService] Error syncing user ${userId}:`, error.message);
      throw error;
    }
  }
}
