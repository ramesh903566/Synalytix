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
import { supabase } from '../../../lib/supabase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function getToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

const apiFetch = async <T>(
  url: string,
  schema: z.ZodType<T>,
): Promise<T> => {
  const token = await getToken();
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const json = await response.json();
  const data = json.data ?? json;
  return schema.parse(data);
};

export const fetchGithubProfile = async (_username: string): Promise<GithubProfile> => {
  return apiFetch('/api/data/github/profile', GithubProfileSchema);
};

export const fetchGithubContributions = async (_username: string): Promise<GithubContributions> => {
  return apiFetch('/api/data/github/contributions', GithubContributionsSchema);
};

export const fetchGithubActivity = async (_username: string): Promise<GithubActivity> => {
  return apiFetch('/api/data/github/activity', GithubActivitySchema);
};

export const fetchGithubRepositories = async (_username: string): Promise<GithubRepository[]> => {
  return apiFetch('/api/data/github/repos', z.array(GithubRepositorySchema));
};

export const fetchGithubLanguages = async (_username: string): Promise<GithubLanguage[]> => {
  return apiFetch('/api/data/github/languages', z.array(GithubLanguageSchema));
};

export const fetchGithubTimeline = async (_username: string, page: number = 1): Promise<GithubTimelineEvent[]> => {
  return apiFetch(`/api/data/github/timeline?page=${page}`, z.array(GithubTimelineEventSchema));
};
