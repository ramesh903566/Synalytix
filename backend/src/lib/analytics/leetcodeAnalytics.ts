import { LeetCodeProfileSnapshot } from '../../types';

export const LeetCodeAnalytics = {
  /**
   * Calculates total solved from a snapshot.
   */
  getTotalSolved(snapshot: Partial<LeetCodeProfileSnapshot>): number {
    return (snapshot.easy_solved || 0) + (snapshot.medium_solved || 0) + (snapshot.hard_solved || 0);
  },

  /**
   * Calculates difficulty distribution as percentages.
   */
  getDifficultyDistribution(snapshot: Partial<LeetCodeProfileSnapshot>) {
    const total = this.getTotalSolved(snapshot);
    if (total === 0) return { easy: 0, medium: 0, hard: 0 };
    return {
      easy: ((snapshot.easy_solved || 0) / total) * 100,
      medium: ((snapshot.medium_solved || 0) / total) * 100,
      hard: ((snapshot.hard_solved || 0) / total) * 100,
    };
  },

  /**
   * Calculates the difference in total solved between current and past snapshot.
   */
  getSolvedDelta(current: Partial<LeetCodeProfileSnapshot>, past: Partial<LeetCodeProfileSnapshot> | null): number {
    if (!past) return this.getTotalSolved(current);
    return this.getTotalSolved(current) - this.getTotalSolved(past);
  },

  /**
   * Calculates growth rate over a period.
   * Growth Rate = (Solved in Period) / (Total Solved - Solved in Period) * 100
   */
  getGrowthRate(current: Partial<LeetCodeProfileSnapshot>, past: Partial<LeetCodeProfileSnapshot> | null): number {
    if (!past) return 0; // brand new
    const solvedInPeriod = this.getSolvedDelta(current, past);
    const totalSolved = this.getTotalSolved(current);
    const previousTotal = totalSolved - solvedInPeriod;
    if (previousTotal <= 0) return 100; // infinite growth if they had 0 before
    return (solvedInPeriod / previousTotal) * 100;
  },

  /**
   * Calculates consistency score (0-100) based on activity_summary over the last 30 days.
   */
  getConsistencyScore(activitySummary: Record<string, number> | null): number {
    if (!activitySummary) return 0;
    
    // activitySummary is usually a map of unix timestamps (seconds) to submission counts
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60;
    
    let activeDays = 0;
    for (const [timestampStr, count] of Object.entries(activitySummary)) {
      const ts = parseInt(timestampStr, 10);
      if (ts >= thirtyDaysAgo && ts <= now && count > 0) {
        activeDays++;
      }
    }
    
    return (activeDays / 30) * 100;
  },

  /**
   * Get contest rating delta between current and past snapshot.
   */
  getContestDelta(current: Partial<LeetCodeProfileSnapshot>, past: Partial<LeetCodeProfileSnapshot> | null): number {
    if (!past || !current.contest_rating || !past.contest_rating) return 0;
    return current.contest_rating - past.contest_rating;
  },

  /**
   * Detect consecutive inactive days.
   */
  getInactiveDays(activitySummary: Record<string, number> | null): number {
    if (!activitySummary) return 0;
    const now = new Date();
    // Start checking from yesterday backwards
    now.setDate(now.getDate() - 1);
    now.setHours(0, 0, 0, 0);
    
    // Normalize activity keys to dates (LeetCode returns unix timestamp)
    const activeDates = new Set<string>();
    for (const [timestampStr, count] of Object.entries(activitySummary)) {
      if (count > 0) {
        const d = new Date(parseInt(timestampStr, 10) * 1000);
        activeDates.add(d.toISOString().split('T')[0]);
      }
    }

    let inactiveCount = 0;
    while (true) {
      const dateStr = now.toISOString().split('T')[0];
      if (activeDates.has(dateStr)) {
        break;
      }
      inactiveCount++;
      now.setDate(now.getDate() - 1);
      // safety limit
      if (inactiveCount > 365) break; 
    }
    
    return inactiveCount;
  }
};
