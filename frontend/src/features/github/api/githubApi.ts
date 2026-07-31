import { z } from 'zod';
import {
  GithubProfile,
  GithubContributions,
  GithubActivity,
  GithubRepository,
  GithubLanguage,
  GithubTimelineEvent,
  GithubProfileSchema,
  GithubContributionsSchema,
  GithubActivitySchema,
  GithubRepositorySchema,
  GithubLanguageSchema,
  GithubTimelineEventSchema
} from '../types/github.types';
import {
  GITHUB_PROFILE_MOCK,
  GITHUB_CONTRIBUTIONS_MOCK,
  GITHUB_ACTIVITY_MOCK,
  GITHUB_REPOS_MOCK,
  GITHUB_LANGUAGES_MOCK,
  GITHUB_TIMELINE_MOCK
} from './mockData';

// Fetch helper with fallback to mock data if API fails or returns 404
const fetchWithFallback = async <T>(
  url: string,
  schema: z.ZodType<T>,
  fallback: T,
  delayMs: number = 800
): Promise<T> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return schema.parse(data);
  } catch (error) {
    console.warn(`Falling back to mock data for ${url}:`, error);
    // Simulate network delay for fallback
    await new Promise(resolve => setTimeout(resolve, delayMs));
    return fallback;
  }
};

export const fetchGithubProfile = async (username: string): Promise<GithubProfile> => {
  const fallback = {
    ...GITHUB_PROFILE_MOCK,
    login: username,
    name: username === 'ramesh903566' ? 'Ramesh Kumar' : username
  };
  return fetchWithFallback(`/api/github/${username}/profile`, GithubProfileSchema, fallback, 800);
};

export const fetchGithubContributions = async (username: string): Promise<GithubContributions> => {
  return fetchWithFallback(`/api/github/${username}/contributions`, GithubContributionsSchema, GITHUB_CONTRIBUTIONS_MOCK, 1000);
};

export const fetchGithubActivity = async (username: string): Promise<GithubActivity> => {
  return fetchWithFallback(`/api/github/${username}/activity`, GithubActivitySchema, GITHUB_ACTIVITY_MOCK, 700);
};

export const fetchGithubRepositories = async (username: string): Promise<GithubRepository[]> => {
  return fetchWithFallback(`/api/github/${username}/repositories`, z.array(GithubRepositorySchema), GITHUB_REPOS_MOCK, 1200);
};

export const fetchGithubLanguages = async (username: string): Promise<GithubLanguage[]> => {
  return fetchWithFallback(`/api/github/${username}/languages`, z.array(GithubLanguageSchema), GITHUB_LANGUAGES_MOCK, 900);
};

export const fetchGithubTimeline = async (username: string, page: number = 1): Promise<GithubTimelineEvent[]> => {
  const start = (page - 1) * 2;
  const end = start + 2;
  const fallbackPage = GITHUB_TIMELINE_MOCK.slice(start, end);
  return fetchWithFallback(`/api/github/${username}/timeline?page=${page}`, z.array(GithubTimelineEventSchema), fallbackPage, 600);
};
