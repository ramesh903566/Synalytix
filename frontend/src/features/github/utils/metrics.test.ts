import { describe, it, expect } from 'vitest';
import { 
  calculateDeveloperScore, 
  calculateTrustScore, 
  calculateActivityLevel, 
  calculateOpenSourceLevel,
  type GithubMetrics 
} from './metrics';

const mockMetrics: GithubMetrics = {
  totalCommits: 100,
  totalPrs: 10,
  totalIssues: 5,
  followers: 50,
  publicRepos: 10,
  totalStars: 100,
  longestStreak: 15,
};

describe('GitHub Metrics Calculator', () => {
  describe('calculateDeveloperScore', () => {
    it('returns 0 for missing metrics', () => {
      // @ts-ignore testing invalid input
      expect(calculateDeveloperScore(null)).toBe(0);
    });

    it('calculates a valid score for normal activity', () => {
      const score = calculateDeveloperScore(mockMetrics);
      // raw = (100 * 1) + (10 * 5) + (5 * 2) = 160
      // Math.log10(161) * 20 + 20 = ~64
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('maxes out at 100 for hyperactive developers', () => {
      const hyperMetrics = { ...mockMetrics, totalCommits: 10000, totalPrs: 5000 };
      expect(calculateDeveloperScore(hyperMetrics)).toBe(100);
    });
  });

  describe('calculateTrustScore', () => {
    it('returns 0 for missing metrics', () => {
      // @ts-ignore
      expect(calculateTrustScore(null, 365)).toBe(0);
    });

    it('scales correctly based on age, followers, and repos', () => {
      const score = calculateTrustScore(mockMetrics, 365); // 1 year
      // age = 10, followers = 3, repos = 6 => total 19
      expect(score).toBe(19);
    });

    it('caps at 100 for maximum trusted profiles', () => {
      const maxMetrics = { ...mockMetrics, followers: 5000, publicRepos: 100 };
      const score = calculateTrustScore(maxMetrics, 365 * 10); // 10 years
      // age max = 40, followers max = 30, repos max = 30 => 100
      expect(score).toBe(100);
    });
  });

  describe('calculateActivityLevel', () => {
    it('calculates score based on longest streak', () => {
      expect(calculateActivityLevel(mockMetrics)).toBe(50); // 15 out of 30 days
    });

    it('caps at 100 for streaks over 30 days', () => {
      const activeMetrics = { ...mockMetrics, longestStreak: 45 };
      expect(calculateActivityLevel(activeMetrics)).toBe(100);
    });
  });

  describe('calculateOpenSourceLevel', () => {
    it('calculates score based on stars and PRs', () => {
      const score = calculateOpenSourceLevel(mockMetrics);
      // stars = (100 / 1000) * 50 = 5
      // prs = (10 / 100) * 50 = 5
      expect(score).toBe(10);
    });

    it('caps at 100 for heavy open source contributors', () => {
      const ossMetrics = { ...mockMetrics, totalStars: 5000, totalPrs: 500 };
      expect(calculateOpenSourceLevel(ossMetrics)).toBe(100);
    });
  });
});
