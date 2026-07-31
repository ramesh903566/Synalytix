import { z } from 'zod';

export const GithubProfileSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  avatarUrl: z.string().url(),
  bio: z.string().nullable(),
  company: z.string().nullable(),
  website: z.string().nullable(),
  location: z.string().nullable(),
  email: z.string().nullable(),
  createdAt: z.string().datetime(),
  followers: z.object({ totalCount: z.number() }),
  following: z.object({ totalCount: z.number() }),
  repositories: z.object({ totalCount: z.number() }),
  gists: z.object({ totalCount: z.number() }),
  isHireable: z.boolean(),
  organizations: z.object({
    nodes: z.array(z.object({ name: z.string(), avatarUrl: z.string().url() }))
  }),
  scores: z.object({
    completion: z.number(),
    developer: z.number(),
    trust: z.number(),
    activityLevel: z.number(),
    openSource: z.number(),
    community: z.number().optional(),
    consistency: z.number().optional()
  })
});

export const GithubContributionsSchema = z.object({
  totalContributions: z.number(),
  streak: z.object({ current: z.number(), longest: z.number() }),
  activeDay: z.string(),
  activeMonth: z.string(),
  averagePerDay: z.number(),
  morningVsEvening: z.object({ morning: z.number(), evening: z.number() }).optional(),
  calendar: z.array(z.object({
    date: z.string(),
    count: z.number(),
    level: z.number()
  }))
});

export const GithubActivitySchema = z.object({
  commits: z.object({ count: z.number(), percentage: z.number(), delta: z.string() }),
  prs: z.object({ count: z.number(), percentage: z.number(), delta: z.string() }),
  issues: z.object({ count: z.number(), percentage: z.number(), delta: z.string() }),
  reviews: z.object({ count: z.number(), percentage: z.number(), delta: z.string() }),
  discussions: z.object({ count: z.number(), percentage: z.number(), delta: z.string() }),
  releases: z.object({ count: z.number(), percentage: z.number(), delta: z.string() }).optional(),
  forks: z.object({ count: z.number(), percentage: z.number(), delta: z.string() }).optional(),
});

export const GithubRepositorySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullable(),
  stargazerCount: z.number(),
  forkCount: z.number(),
  primaryLanguage: z.object({ name: z.string(), color: z.string() }).nullable(),
  updatedAt: z.string().datetime(),
  issues: z.number(),
  watchers: z.number(),
  size: z.number(),
  healthScore: z.number(),
  activityScore: z.number(),
  licenseInfo: z.object({ name: z.string() }).nullable(),
  topics: z.array(z.string()),
  isPrivate: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  isFork: z.boolean().optional(),
  isTemplate: z.boolean().optional(),
});

export const GithubLanguageSchema = z.object({
  name: z.string(),
  bytes: z.number(),
  color: z.string()
});

export const GithubTimelineEventSchema = z.object({
  id: z.string().or(z.number()),
  type: z.string(),
  repo: z.string(),
  description: z.string(),
  timestamp: z.string().datetime(),
  link: z.string().url().optional()
});

export type GithubProfile = z.infer<typeof GithubProfileSchema>;
export type GithubContributions = z.infer<typeof GithubContributionsSchema>;
export type GithubActivity = z.infer<typeof GithubActivitySchema>;
export type GithubRepository = z.infer<typeof GithubRepositorySchema>;
export type GithubLanguage = z.infer<typeof GithubLanguageSchema>;
export type GithubTimelineEvent = z.infer<typeof GithubTimelineEventSchema>;
