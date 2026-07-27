import { useQuery } from '@tanstack/react-query';
import { XApiClient } from '../services/xApiClient';
import { generateAIInsights } from '../services/aiInsightsGenerator';
import { useXAnalyticsStore } from '../store/useXAnalyticsStore';

export const useOverviewKPIs = () => {
  const { dateRange, dataSourceMode } = useXAnalyticsStore();
  return useQuery({
    queryKey: ['x-overview-kpis', dateRange, dataSourceMode],
    queryFn: () => XApiClient.getOverviewKPIs(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAIInsights = (metrics: any) => {
  return useQuery({
    queryKey: ['x-ai-insights', metrics],
    queryFn: () => generateAIInsights(metrics),
    enabled: !!metrics && Object.keys(metrics).length > 0,
    staleTime: 10 * 60 * 1000,
  });
};

export const useAudienceDemographics = () => {
  const { dateRange, dataSourceMode } = useXAnalyticsStore();
  return useQuery({
    queryKey: ['x-audience-demographics', dateRange, dataSourceMode],
    queryFn: () => XApiClient.getAudienceDemographics(dateRange),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useAudienceHeatmap = () => {
  const { dateRange, dataSourceMode } = useXAnalyticsStore();
  return useQuery({
    queryKey: ['x-audience-heatmap', dateRange, dataSourceMode],
    queryFn: () => XApiClient.getAudienceActivityHeatmap(dateRange),
    staleTime: 60 * 60 * 1000,
  });
};

export const useContentPosts = (page: number = 1) => {
  const { dateRange, dataSourceMode } = useXAnalyticsStore();
  return useQuery({
    queryKey: ['x-content-posts', dateRange, page, dataSourceMode],
    queryFn: () => XApiClient.getContentPosts(dateRange, page),
    staleTime: 5 * 60 * 1000,
  });
};

export const useVideoStats = () => {
  const { dateRange, dataSourceMode } = useXAnalyticsStore();
  return useQuery({
    queryKey: ['x-video-stats', dateRange, dataSourceMode],
    queryFn: () => XApiClient.getVideoStats(dateRange),
    staleTime: 5 * 60 * 1000,
  });
};

export const useLiveBroadcasts = () => {
  const { dateRange, dataSourceMode } = useXAnalyticsStore();
  return useQuery({
    queryKey: ['x-live-broadcasts', dateRange, dataSourceMode],
    queryFn: () => XApiClient.getLiveBroadcasts(dateRange),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSpaces = () => {
  const { dateRange, dataSourceMode } = useXAnalyticsStore();
  return useQuery({
    queryKey: ['x-spaces', dateRange, dataSourceMode],
    queryFn: () => XApiClient.getSpaces(dateRange),
    staleTime: 5 * 60 * 1000,
  });
};
