import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { GenerateInput, GenerateOutput } from "../types/recommendations";

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchRecommendations(): Promise<GenerateOutput["data"] | null> {
  await delay();
  return {
    runId: 'run_123',
    recommendations: [
      {
        id: 'rec_1',
        title: 'Post a new Reel',
        description: 'Your audience is most active on Tuesdays. Post a new reel to maximize reach.',
        reasoning: "Based on your 40% increase in GitHub activity, now is a great time to showcase your open source contributions.",
        category: "OPEN_SOURCE",
        priority: "HIGH",
        impactScore: 85,
        difficulty: "MEDIUM",
        estimatedTime: { value: 2, unit: "weeks" },
        expectedOutcome: "Increased visibility among recruiters looking for active contributors.",
        actionSteps: [
          "Identify 2 key projects you contributed to.",
          "Write a concise summary of your impact.",
          "Pin them to your GitHub profile."
        ],
        dataSources: ["github"],
        confidenceLevel: "high",
        completedAt: null,
        dismissedAt: null,
        createdAt: new Date().toISOString(),
        providerUsed: "gemini"
      }
    ],
    scores: { career: 80, employability: 85, branding: 75, technical: 90, computedAt: new Date().toISOString() },
    scoreDelta: { career: 2, employability: 1, branding: 3, technical: 0 },
    weeklyPlan: ['Learn React', 'Build project', 'Apply to jobs', 'Update resume', 'Network'],
    monthlyRoadmap: [
      { week: 1, goal: 'Learn basics', milestones: ['HTML', 'CSS'] },
      { week: 2, goal: 'Learn JS', milestones: ['DOM', 'ES6'] },
      { week: 3, goal: 'Learn React', milestones: ['Components', 'Hooks'] },
      { week: 4, goal: 'Build project', milestones: ['Planning', 'Coding'] }
    ],
    gaps: { skills: ['System Design'], assets: ['Portfolio'], activities: [] },
    opportunityAlerts: [
      { id: 'alert_1', title: 'New Job Opening', description: 'Google is hiring', trigger: 'Match', detectedAt: new Date().toISOString(), dismissedAt: null }
    ]
  };
}

async function generateRecommendations(input: GenerateInput): Promise<GenerateOutput["data"]> {
  await delay(1000);
  return (await fetchRecommendations()) as GenerateOutput["data"];
}

async function markComplete(id: string): Promise<void> {
  await delay();
}

async function dismissRecommendation(id: string): Promise<void> {
  await delay();
}

async function dismissOpportunityAlert(id: string): Promise<void> {
  await delay();
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
