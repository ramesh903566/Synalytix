import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { GenerateInput, GenerateOutput } from "../types/recommendations";

const API_BASE = "http://localhost:4000/api";

async function fetchRecommendations(): Promise<GenerateOutput["data"]> {
  const token = localStorage.getItem("token") || "";
  const res = await fetch(`${API_BASE}/recommendations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    if (res.status === 404) return null as any;
    throw new Error("Failed to fetch recommendations");
  }
  const json = await res.json();
  return json.data;
}

async function generateRecommendations(input: GenerateInput): Promise<GenerateOutput["data"]> {
  const token = localStorage.getItem("token") || "";
  const res = await fetch(`${API_BASE}/recommendations/generate`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to generate recommendations");
  const json = await res.json();
  return json.data;
}

async function markComplete(id: string): Promise<void> {
  const token = localStorage.getItem("token") || "";
  const res = await fetch(`${API_BASE}/recommendations/${id}/complete`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to mark complete");
}

async function dismissRecommendation(id: string): Promise<void> {
  const token = localStorage.getItem("token") || "";
  const res = await fetch(`${API_BASE}/recommendations/${id}/dismiss`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to dismiss");
}

async function dismissOpportunityAlert(id: string): Promise<void> {
  const token = localStorage.getItem("token") || "";
  const res = await fetch(`${API_BASE}/recommendations/alerts/${id}/dismiss`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to dismiss alert");
}

export function useRecommendations() {
  return useQuery({
    queryKey: ["recommendations"],
    queryFn: fetchRecommendations,
    staleTime: 5 * 60 * 1000, // 5 mins
  });
}

export function useGenerateRecommendations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateRecommendations,
    onSuccess: (data) => {
      queryClient.setQueryData(["recommendations"], data);
    },
  });
}

export function useCompleteRecommendation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
}

export function useDismissRecommendation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dismissRecommendation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
}

export function useDismissOpportunityAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dismissOpportunityAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
}
