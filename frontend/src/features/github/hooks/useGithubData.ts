import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchGithubProfile,
  fetchGithubContributions,
  fetchGithubActivity,
  fetchGithubRepositories,
  fetchGithubLanguages,
  fetchGithubTimeline
} from '../api/githubApi';

export const useGithubProfile = (username: string) => {
  return useQuery({
    queryKey: ['github', 'profile', username],
    queryFn: () => fetchGithubProfile(username),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useGithubContributions = (username: string) => {
  return useQuery({
    queryKey: ['github', 'contributions', username],
    queryFn: () => fetchGithubContributions(username),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGithubActivity = (username: string) => {
  return useQuery({
    queryKey: ['github', 'activity', username],
    queryFn: () => fetchGithubActivity(username),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const useGithubRepositories = (username: string) => {
  return useQuery({
    queryKey: ['github', 'repositories', username],
    queryFn: () => fetchGithubRepositories(username),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useGithubLanguages = (username: string) => {
  return useQuery({
    queryKey: ['github', 'languages', username],
    queryFn: () => fetchGithubLanguages(username),
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
  });
};

export const useGithubTimeline = (username: string) => {
  return useInfiniteQuery({
    queryKey: ['github', 'timeline', username],
    queryFn: ({ pageParam = 1 }) => fetchGithubTimeline(username, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      // If we got less than 2 items (our simulated page size), we're done
      return lastPage.length === 2 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
