import {
  GithubProfile,
  GithubContributions,
  GithubActivity,
  GithubRepository,
  GithubLanguage,
  GithubTimelineEvent
} from '../types/github.types';
import {
  GITHUB_PROFILE_MOCK,
  GITHUB_CONTRIBUTIONS_MOCK,
  GITHUB_ACTIVITY_MOCK,
  GITHUB_REPOS_MOCK,
  GITHUB_LANGUAGES_MOCK,
  GITHUB_TIMELINE_MOCK
} from './mockData';

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchGithubProfile = async (username: string): Promise<GithubProfile> => {
  await delay(800);
  return {
    ...GITHUB_PROFILE_MOCK,
    login: username,
    name: username === 'ramesh903566' ? 'Ramesh Kumar' : username
  };
};

export const fetchGithubContributions = async (username: string): Promise<GithubContributions> => {
  await delay(1000);
  return GITHUB_CONTRIBUTIONS_MOCK;
};

export const fetchGithubActivity = async (username: string): Promise<GithubActivity> => {
  await delay(700);
  return GITHUB_ACTIVITY_MOCK;
};

export const fetchGithubRepositories = async (username: string): Promise<GithubRepository[]> => {
  await delay(1200);
  return GITHUB_REPOS_MOCK;
};

export const fetchGithubLanguages = async (username: string): Promise<GithubLanguage[]> => {
  await delay(900);
  return GITHUB_LANGUAGES_MOCK;
};

export const fetchGithubTimeline = async (username: string, page: number = 1): Promise<GithubTimelineEvent[]> => {
  await delay(600);
  // Return different subsets to simulate pagination
  const start = (page - 1) * 2;
  const end = start + 2;
  return GITHUB_TIMELINE_MOCK.slice(start, end);
};
