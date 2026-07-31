export interface GithubMetrics {
  totalCommits: number;
  totalPrs: number;
  totalIssues: number;
  followers: number;
  publicRepos: number;
  totalStars: number;
  longestStreak: number;
}

export function calculateDeveloperScore(metrics: GithubMetrics): number {
  if (!metrics) return 0;
  
  // Weights for different contribution types
  const commitWeight = 1;
  const prWeight = 5;
  const issueWeight = 2;
  
  const rawScore = 
    (metrics.totalCommits * commitWeight) + 
    (metrics.totalPrs * prWeight) + 
    (metrics.totalIssues * issueWeight);
    
  // Logarithmic scaling to max out near 100 for very active devs
  // A raw score of 1000 = ~60, 5000 = ~85, 10000 = ~95
  const scaledScore = Math.min(100, Math.max(0, Math.log10(rawScore + 1) * 20 + 20));
  
  return Number.isNaN(scaledScore) ? 0 : Math.round(scaledScore);
}

export function calculateTrustScore(metrics: GithubMetrics, accountAgeDays: number): number {
  if (!metrics) return 0;

  // Base trust on account age (max 40 points for 4 years)
  const ageScore = Math.min(40, (accountAgeDays / 365) * 10);
  
  // Followers demonstrate community trust (max 30 points for 500 followers)
  const followerScore = Math.min(30, (metrics.followers / 500) * 30);
  
  // Public repos demonstrate transparency (max 30 points for 50 repos)
  const repoScore = Math.min(30, (metrics.publicRepos / 50) * 30);
  
  return Math.round(ageScore + followerScore + repoScore);
}

export function calculateActivityLevel(metrics: GithubMetrics): number {
  if (!metrics) return 0;
  
  // Activity Level is primarily driven by recent streaks
  // A 30-day streak is considered 100% active
  const streakScore = Math.min(100, (metrics.longestStreak / 30) * 100);
  
  return Math.round(streakScore);
}

export function calculateOpenSourceLevel(metrics: GithubMetrics): number {
  if (!metrics) return 0;
  
  // Open Source Level is driven by Stars earned and PRs merged (assumed public PRs)
  // 1000 stars or 100 PRs = 100 level
  const starScore = Math.min(50, (metrics.totalStars / 1000) * 50);
  const prScore = Math.min(50, (metrics.totalPrs / 100) * 50);
  
  return Math.round(starScore + prScore);
}
