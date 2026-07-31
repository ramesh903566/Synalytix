import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '../../lib/auth-token';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

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

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }
  return data;
}

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
    mutationFn: async (payload: GenerateDraftsPayload): Promise<Record<string, string>> => {
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE}/api/chat/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: `Draft: ${payload.description.slice(0, 50)}`,
          model_provider: 'openai',
          model_name: 'gpt-4o',
        }),
      });
      const conv = await res.json();
      const conversationId = conv.data?.id;

      if (!conversationId) throw new Error('Failed to create draft conversation');

      const prompt = `Generate social media posts for the following topic. Return ONLY a JSON object with keys for each platform (${payload.apps.join(', ')}) and the post content as the value. Topic: ${payload.description}`;

      const token2 = await getAuthToken();
      const streamRes = await fetch(`${API_BASE}/api/chat/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token2 ? { Authorization: `Bearer ${token2}` } : {}),
        },
        body: JSON.stringify({ content: prompt }),
      });

      if (!streamRes.ok) throw new Error('Failed to generate drafts');

      const reader = streamRes.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === 'token') fullText += event.content;
          } catch { /* skip */ }
        }
      }

      // Parse JSON from the response
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback: create drafts from raw text per platform
      const drafts: Record<string, string> = {};
      payload.apps.forEach(app => {
        drafts[app] = fullText || `Draft for ${app}: ${payload.description}`;
      });
      return drafts;
    },
  });
};
