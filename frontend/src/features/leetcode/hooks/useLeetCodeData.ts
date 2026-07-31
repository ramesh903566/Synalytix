import { useQuery } from '@tanstack/react-query';
import { LeetCodeDataResponse } from '../types/leetcode.types';
import { getLeetCodeData } from '../../../lib/api';

export const useLeetCodeData = () => {
  return useQuery<LeetCodeDataResponse, Error>({
    queryKey: ['leetcode', 'data'],
    queryFn: async () => {
      const response = await getLeetCodeData();
      if (!response.success || !response.data) {
        throw new Error(response.error as string || 'Failed to fetch LeetCode data');
      }
      return response.data as LeetCodeDataResponse;
    },
    staleTime: 1000 * 60 * 60 * 6,
  });
};
