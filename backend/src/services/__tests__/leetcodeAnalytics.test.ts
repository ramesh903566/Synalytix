import { describe, it, expect } from 'vitest';
import {
  calculateGrowthRate,
  calculateConsistencyScore,
  calculateEstimatedWeeklyTime
} from '../leetcodeAnalytics';
import { LeetCodeProfileSnapshot } from '../../types';

describe('leetcodeAnalytics', () => {
  const mockSnapshots: LeetCodeProfileSnapshot[] = [
    {
      id: '1',
      user_id: 'user1',
      timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      ranking: 1000,
      contest_rating: null,
      global_ranking: null,
      easy_solved: 10,
      medium_solved: 5,
      hard_solved: 1,
      acceptance_rate: 50,
      reputation: 0,
      streak: 1,
      activity_summary: null
    },
    {
      id: '2',
      user_id: 'user1',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      ranking: 900,
      contest_rating: null,
      global_ranking: null,
      easy_solved: 15,
      medium_solved: 7,
      hard_solved: 1,
      acceptance_rate: 55,
      reputation: 0,
      streak: 2,
      activity_summary: null
    },
    {
      id: '3',
      user_id: 'user1',
      timestamp: new Date().toISOString(),
      ranking: 850,
      contest_rating: null,
      global_ranking: null,
      easy_solved: 20,
      medium_solved: 10,
      hard_solved: 2,
      acceptance_rate: 60,
      reputation: 0,
      streak: 3,
      activity_summary: null
    }
  ];

  describe('calculateGrowthRate', () => {
    it('calculates the growth rate correctly over the past 7 days', () => {
      // Current: 20 + 10 + 2 = 32
      // 7 days ago (closest is the 8 days ago one): 10 + 5 + 1 = 16
      // Growth: (32 - 16) / 16 = 1.0 (100%)
      const rate = calculateGrowthRate(mockSnapshots, 7);
      expect(rate).toBe(100.00);
    });

    it('returns 0 if not enough snapshots', () => {
      expect(calculateGrowthRate([mockSnapshots[0]], 7)).toBe(0);
      expect(calculateGrowthRate([], 7)).toBe(0);
    });
  });

  describe('calculateConsistencyScore', () => {
    it('calculates the score correctly based on active days', () => {
      // 16 -> 23 -> 32 (both steps have an increase)
      // activeDays = 2 => score = 20
      const score = calculateConsistencyScore(mockSnapshots);
      expect(score).toBe(20);
    });

    it('returns 0 if empty', () => {
      expect(calculateConsistencyScore([])).toBe(0);
    });
  });

  describe('calculateEstimatedWeeklyTime', () => {
    it('calculates estimated time spent correctly', () => {
      // Current vs 8 days ago
      // dEasy = 10, dMed = 5, dHard = 1
      // 10*15 + 5*45 + 1*120 = 150 + 225 + 120 = 495 minutes
      // 495 / 60 = 8.25 => 8.3
      const time = calculateEstimatedWeeklyTime(mockSnapshots);
      expect(time).toBe(8.3);
    });
  });
});
