import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LeetCodeService } from '../leetcodeService';
import { redis } from '../../lib/redis';

// Mock dependencies
vi.mock('../../lib/redis', () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
  }
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('LeetCodeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProfile', () => {
    it('returns cached data if available', async () => {
      const mockCachedData = { ranking: 1234, easy_solved: 10 };
      vi.mocked(redis.get).mockResolvedValueOnce(JSON.stringify(mockCachedData));

      const result = await LeetCodeService.getProfile('testuser');

      expect(redis.get).toHaveBeenCalledWith('leetcode_profile_testuser');
      expect(mockFetch).not.toHaveBeenCalled();
      expect(result).toEqual(mockCachedData);
    });

    it('fetches from API if cache misses and valid user', async () => {
      vi.mocked(redis.get).mockResolvedValueOnce(null);
      
      const mockApiResponse = {
        data: {
          matchedUser: {
            username: 'testuser',
            submitStats: {
              acSubmissionNum: [
                { difficulty: 'All', count: 100 },
                { difficulty: 'Easy', count: 50 },
                { difficulty: 'Medium', count: 30 },
                { difficulty: 'Hard', count: 20 },
              ]
            },
            profile: {
              ranking: 5000,
              reputation: 10
            },
            userCalendar: {
              streak: 5,
              totalActiveDays: 50,
              submissionCalendar: "{}"
            }
          },
          userContestRanking: {
            rating: 1500,
            globalRanking: 10000
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockApiResponse)
      });

      const result = await LeetCodeService.getProfile('testuser');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(redis.set).toHaveBeenCalled();
      expect(result.ranking).toBe(5000);
      expect(result.easy_solved).toBe(50);
      expect(result.contest_rating).toBe(1500);
    });

    it('throws error if user not found', async () => {
      vi.mocked(redis.get).mockResolvedValueOnce(null);
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: { matchedUser: null, userContestRanking: null } })
      });

      await expect(LeetCodeService.getProfile('invalid_user')).rejects.toThrow('User not found or profile is private');
    });

    it('retries on rate limit (429)', async () => {
      vi.mocked(redis.get).mockResolvedValueOnce(null);
      
      // Fail twice with 429
      mockFetch.mockResolvedValueOnce({ ok: false, status: 429 });
      mockFetch.mockResolvedValueOnce({ ok: false, status: 429 });
      
      // Succeed on 3rd
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          data: {
            matchedUser: {
              username: 'testuser',
              submitStats: { acSubmissionNum: [] },
              profile: { ranking: 1, reputation: 0 },
              userCalendar: { streak: 1, totalActiveDays: 1, submissionCalendar: "{}" }
            },
            userContestRanking: null
          }
        })
      });

      const result = await LeetCodeService.getProfile('testuser');
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(result.ranking).toBe(1);
    });
  });
});
