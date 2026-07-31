import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppName } from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const GitHubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable().optional(),
  html_url: z.string(),
  language: z.string().nullable().optional(),
  is_private: z.boolean(),
  updated_at: z.string(),
});
export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;

export const GitHubCreateRepoPayloadSchema = z.object({
  name: z.string().min(1, 'Repository name is required').regex(/^[a-zA-Z0-9_.-]+$/, 'Invalid repository name'),
  description: z.string().optional(),
  private: z.boolean().optional(),
  auto_init: z.boolean().optional(),
  gitignore_template: z.string().optional(),
  license_template: z.string().optional(),
});
export type GitHubCreateRepoPayload = z.infer<typeof GitHubCreateRepoPayloadSchema>;

export const GitHubPublishPayloadSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  branch: z.string().default('main'),
  message: z.string().min(1, 'Commit message is required'),
  files: z.array(z.object({
    path: z.string(),
    content: z.string(),
    encoding: z.enum(['utf-8', 'base64']).optional(),
  })).min(1, 'At least one file is required'),
});
export type GitHubPublishPayload = z.infer<typeof GitHubPublishPayloadSchema>;

export const GenerateDraftsPayloadSchema = z.object({
  description: z.string(),
  apps: z.array(z.string()),
});
export type GenerateDraftsPayload = z.infer<typeof GenerateDraftsPayloadSchema>;

// ─── API Functions ───────────────────────────────────────────────────────────

const getToken = () => localStorage.getItem('token');

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, { ...options, headers });
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }
  return data;
};

// ─── React Query Hooks ───────────────────────────────────────────────────────

export const useGitHubRepos = () => {
  return useQuery({
    queryKey: ['github', 'repos'],
    queryFn: async (): Promise<GitHubRepo[]> => {
      const data = await fetchWithAuth('/api/studio/github/repos');
      return z.array(GitHubRepoSchema).parse(data);
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateRepo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: GitHubCreateRepoPayload) => {
      const parsed = GitHubCreateRepoPayloadSchema.parse(payload);
      return await fetchWithAuth('/api/studio/github/repos', {
        method: 'POST',
        body: JSON.stringify(parsed),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github', 'repos'] });
    },
  });
};

export const usePublishToRepo = () => {
  return useMutation({
    mutationFn: async (payload: GitHubPublishPayload) => {
      const parsed = GitHubPublishPayloadSchema.parse(payload);
      return await fetchWithAuth('/api/studio/github/publish', {
        method: 'POST',
        body: JSON.stringify(parsed),
      });
    },
  });
};

export const useGenerateDrafts = () => {
  return useMutation({
    mutationFn: async (payload: GenerateDraftsPayload) => {
      // Mock generation delay
      return new Promise<Record<string, string>>((resolve) => {
        setTimeout(() => {
          const drafts: Record<string, string> = {};
          payload.apps.forEach(app => {
            let prefix = '';
            let suffix = '';
            if (app === 'linkedin') { prefix = 'Excited to share an update on my professional journey. '; suffix = '\n\n#ProfessionalGrowth #Innovation'; }
            if (app === 'x') { suffix = ' 🚀 #buildinpublic'; }
            if (app === 'instagram') { suffix = '\n\n.\n.\n.\n#inspiration #daily #grow'; }
            if (app === 'github') { prefix = '🚀 Released new features: \n'; suffix = '\nCheck out the repo!'; }
            if (app === 'leetcode') { prefix = 'Another milestone reached! '; suffix = '\n#algorithms #dailycoding'; }
            
            drafts[app] = `${prefix}${payload.description}${suffix}`;
          });
          resolve(drafts);
        }, 1500);
      });
    },
  });
};
