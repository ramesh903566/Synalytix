import { z } from 'zod';

export const KPISchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number(),
  change: z.number(), // percentage change
  trend: z.enum(['up', 'down', 'neutral']),
  history: z.array(
    z.object({
      date: z.string(),
      value: z.number(),
    })
  ).optional(),
});

export type KPI = z.infer<typeof KPISchema>;

export const ContentPostSchema = z.object({
  id: z.string(),
  content: z.string(),
  mediaUrl: z.string().optional(),
  publishedAt: z.string(),
  type: z.enum(['Text', 'Image', 'Video', 'Thread', 'Link']),
  impressions: z.number(),
  likes: z.number(),
  replies: z.number(),
  reposts: z.number(),
  bookmarks: z.number(),
  shares: z.number(),
  engagementRate: z.number(),
  profileVisits: z.number(),
  status: z.enum(['Published', 'Scheduled', 'Draft']),
});

export type ContentPost = z.infer<typeof ContentPostSchema>;

export const VideoStatsSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnailUrl: z.string().optional(),
  publishedAt: z.string(),
  views: z.number(),
  watchTimeHours: z.number(),
  avgWatchDurationSeconds: z.number(),
  completionRate: z.number(),
  performanceScore: z.number(),
});

export type VideoStats = z.infer<typeof VideoStatsSchema>;

export const LiveBroadcastSchema = z.object({
  id: z.string(),
  title: z.string(),
  startedAt: z.string(),
  endedAt: z.string().optional(),
  status: z.enum(['Live', 'Ended', 'Scheduled']),
  concurrentViewers: z.number().optional(),
  peakViewers: z.number(),
  avgWatchTimeMinutes: z.number(),
  durationMinutes: z.number(),
  replayViews: z.number(),
});

export type LiveBroadcast = z.infer<typeof LiveBroadcastSchema>;

export const SpaceSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['Live', 'Ended', 'Scheduled']),
  scheduledFor: z.string().optional(),
  listeners: z.number(),
  peakListeners: z.number(),
  speakersCount: z.number(),
  durationMinutes: z.number(),
  replayEnabled: z.boolean(),
  retentionRate: z.number(),
});

export type Space = z.infer<typeof SpaceSchema>;

export const AIInsightSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['positive', 'negative', 'opportunity', 'warning', 'insight', 'action']),
  confidence: z.number(),
  actionText: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']),
});

export type AIInsight = z.infer<typeof AIInsightSchema>;

export type DateRange = '7D' | '2W' | '4W' | '3M' | '1Y' | 'Custom';
export type ChartType = 'area' | 'line' | 'bar';
