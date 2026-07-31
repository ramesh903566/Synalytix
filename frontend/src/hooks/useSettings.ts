import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchModels,
  saveProvider,
  deleteProvider,
  testProvider,
  type ProviderModel,
} from "../lib/chat-api";

// ─── AI Providers ───────────────────────────────────────────────────────────

export function useAIProviders() {
  return useQuery<ProviderModel[]>({
    queryKey: ["ai-models"],
    queryFn: fetchModels,
    staleTime: 10_000,
  });
}

export function useSaveProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveProvider,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ai-models"] });
    },
  });
}

export function useDeleteProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProvider,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ai-models"] });
    },
  });
}

export function useTestProviderConnection() {
  return useMutation({
    mutationFn: testProvider,
  });
}

// ─── AI Custom Instructions ─────────────────────────────────────────────────

export interface CustomInstructions {
  instructions: string;
}

async function fetchInstructions(provider: string): Promise<CustomInstructions> {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `/api/settings/ai-instructions?provider=${encodeURIComponent(provider)}`,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!res.ok) throw new Error("Failed to fetch instructions");
  return res.json().then((r) => r.data);
}

async function saveInstructions(
  provider: string,
  instructions: string
): Promise<void> {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/settings/ai-instructions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ provider, instructions }),
  });
  if (!res.ok) throw new Error("Failed to save instructions");
}

export function useProviderInstructions(provider: string) {
  return useQuery<CustomInstructions>({
    queryKey: ["ai-instructions", provider],
    queryFn: () => fetchInstructions(provider),
    staleTime: 30_000,
  });
}

export function useSaveProviderInstructions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ provider, instructions }: { provider: string; instructions: string }) =>
      saveInstructions(provider, instructions),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["ai-instructions", variables.provider] });
    },
  });
}

// ─── Platform Connections ───────────────────────────────────────────────────

export interface PlatformConnection {
  id: string;
  platform: string;
  platform_username: string;
  platform_user_id: string;
  last_synced: string | null;
  created_at: string;
}

async function fetchConnections(): Promise<PlatformConnection[]> {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/auth/status", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch connections");
  const data = await res.json();
  return data.data?.connections || [];
}

export function usePlatformConnections() {
  return useQuery<PlatformConnection[]>({
    queryKey: ["platform-connections"],
    queryFn: fetchConnections,
    staleTime: 10_000,
  });
}

// ─── LeetCode ───────────────────────────────────────────────────────────────

async function connectLeetCode(username: string): Promise<void> {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/data/leetcode/connect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to connect LeetCode");
  }
}

async function syncLeetCode(): Promise<void> {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/data/leetcode/sync", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to sync LeetCode");
  }
}

async function disconnectPlatform(platform: string): Promise<void> {
  const token = localStorage.getItem("token");
  const res = await fetch(`/api/auth/disconnect/${platform}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to disconnect");
}

export function useConnectLeetCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: connectLeetCode,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["platform-connections"] });
    },
  });
}

export function useSyncLeetCode() {
  return useMutation({ mutationFn: syncLeetCode });
}

export function useDisconnectPlatform() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: disconnectPlatform,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["platform-connections"] });
    },
  });
}

// ─── Calendar Connections ───────────────────────────────────────────────────

export interface CalendarConnection {
  id: string;
  provider: string;
  email: string;
  status: string;
  lastSynced: string;
}

async function fetchCalendarConnections(): Promise<CalendarConnection[]> {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/auth/status", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch connections");
  const data = await res.json();
  const connections = data.data?.connections || [];
  return connections
    .filter((c: any) => c.platform === "google-calendar")
    .map((c: any) => ({
      id: c.id,
      provider: "google",
      email: c.platform_username || "Google Calendar",
      status: "connected",
      lastSynced: c.last_synced || c.updated_at,
    }));
}

export function useCalendarConnections() {
  return useQuery<CalendarConnection[]>({
    queryKey: ["calendar-connections"],
    queryFn: fetchCalendarConnections,
    staleTime: 10_000,
  });
}

export function useConnectGoogleCalendar() {
  return useMutation({
    mutationFn: async () => {
      // Redirect to OAuth flow
      window.location.href = "/api/auth/connect/google-calendar";
    },
  });
}

export function useDisconnectCalendar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => disconnectPlatform("google-calendar"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["calendar-connections"] });
      qc.invalidateQueries({ queryKey: ["platform-connections"] });
    },
  });
}
