import { supabase } from './supabase';

type ApiEnvelope<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string | { message?: string };
  message?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function getToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ApiEnvelope<T>> {
  try {
    const token = await getToken();
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || `Request failed (${res.status})` };
    }
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { success: false, error: message };
  }
}

export async function connectPlatform(platform: string): Promise<void> {
  const result = await apiFetch<{ url: string }>(`/api/auth/connect/${platform}?format=json`);
  if (result.success && result.data?.url) {
    window.location.href = result.data.url;
  } else {
    throw new Error(typeof result.error === 'string' ? result.error : result.error?.message || 'Failed to start connection');
  }
}

export async function getConnectionStatus(): Promise<ApiEnvelope<{ connected: string[]; connections: Array<{ platform: string; username: string; connected_at: string; expires_at: string | null }> }>> {
  return apiFetch('/api/auth/status');
}

export async function disconnectPlatform(platform: string): Promise<ApiEnvelope> {
  return apiFetch(`/api/auth/disconnect/${platform}`, { method: 'DELETE' });
}

export async function getDashboardSummary(): Promise<ApiEnvelope> {
  return apiFetch('/api/data/summary');
}

export async function getGitHubData(): Promise<ApiEnvelope> {
  return apiFetch('/api/data/github/all');
}

export async function getInstagramData(): Promise<ApiEnvelope> {
  return apiFetch('/api/data/instagram/all');
}

export async function getXData(): Promise<ApiEnvelope> {
  return apiFetch('/api/data/x/all');
}

export async function getLeetCodeData(): Promise<ApiEnvelope> {
  return apiFetch('/api/data/leetcode/all');
}

export async function getLinkedInData(): Promise<ApiEnvelope> {
  return apiFetch('/api/data/linkedin/all');
}

export async function connectLeetCode(username: string): Promise<ApiEnvelope> {
  const result = await apiFetch('/api/data/leetcode/connect', {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
  if (!result.success) {
    throw new Error(typeof result.error === 'string' ? result.error : 'Failed to connect LeetCode');
  }
  return result;
}

export async function generateRecommendations(options?: {
  forceRefresh?: boolean;
  focusCategory?: string;
}): Promise<ApiEnvelope> {
  return apiFetch('/api/recommendations/generate', {
    method: 'POST',
    body: JSON.stringify(options || {}),
  });
}

export async function getRecommendationHistory(): Promise<ApiEnvelope> {
  return apiFetch('/api/recommendations');
}

export async function completeRecommendation(id: string): Promise<ApiEnvelope> {
  return apiFetch(`/api/recommendations/${id}/complete`, { method: 'POST' });
}

export async function dismissRecommendation(id: string): Promise<ApiEnvelope> {
  return apiFetch(`/api/recommendations/${id}/dismiss`, { method: 'POST' });
}
