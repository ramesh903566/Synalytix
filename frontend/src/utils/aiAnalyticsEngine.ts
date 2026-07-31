import type { PlatformAnalyticsData, PlatformType, CrossPlatformInsights, AIInsights } from '../types/analytics';

function computeScore(metrics: { views?: number; engagements?: number; reach?: number; followers?: number }): number {
  const views = metrics.views || 0;
  const engagements = metrics.engagements || 0;
  const reach = metrics.reach || 0;
  const followers = metrics.followers || 0;
  const engagementRate = views > 0 ? (engagements / views) * 100 : 0;
  const reachRate = views > 0 ? (reach / views) * 100 : 0;
  return Math.min(100, Math.round(engagementRate * 2 + reachRate * 0.5 + Math.log10(followers + 1) * 10));
}

export const UniversalAIEngine = {
  generateInsights(metrics: { views?: number; engagements?: number; reach?: number; followers?: number }): AIInsights {
    const healthScore = computeScore(metrics);
    return {
      healthScore,
      growthScore: Math.min(100, healthScore + Math.round(Math.random() * 20 - 10)),
      engagementScore: Math.min(100, Math.round((metrics.engagements || 0) / Math.max(metrics.views || 1, 1) * 500)),
      reachScore: Math.min(100, Math.round((metrics.reach || 0) / Math.max(metrics.views || 1, 1) * 100)),
      consistencyScore: Math.round(60 + Math.random() * 30),
      audienceHealthScore: Math.round(50 + Math.random() * 40),
      postingFrequency: '3-4 times per week',
      topPerformingContentType: 'Reels',
      growthTrend: healthScore > 70 ? 'Improving' : healthScore > 40 ? 'Stable' : 'Declining',
      recommendations: [
        { type: 'optimal_time', title: 'Post during peak hours', description: 'Your audience is most active between 6-9 PM.', impact: '+25% reach' },
        { type: 'content_mix', title: 'Increase video content', description: 'Video posts get 2x more engagement.', impact: '+35% engagement' },
      ],
      summary: `Health score is ${healthScore}/100. ${healthScore > 70 ? 'Strong performance.' : 'Room for improvement.'}`,
    };
  },

  generateCrossPlatformInsights(data: Record<PlatformType, PlatformAnalyticsData | null>): CrossPlatformInsights {
    const platforms = Object.entries(data).filter(([, v]) => v !== null) as [PlatformType, PlatformAnalyticsData][];
    const totalViews = platforms.reduce((sum, [, p]) => sum + (p.aggregatedMetrics.views || 0), 0);
    const totalEngagements = platforms.reduce((sum, [, p]) => sum + (p.aggregatedMetrics.engagements || 0), 0);
    const totalFollowers = platforms.reduce((sum, [, p]) => sum + (p.aggregatedMetrics.followers || 0), 0);

    const platformScores = platforms.map(([name, p]) => ({ name, score: computeScore(p.aggregatedMetrics) }));
    const sorted = platformScores.sort((a, b) => b.score - a.score);

    return {
      overallHealthScore: platformScores.length > 0 ? Math.round(platformScores.reduce((s, p) => s + p.score, 0) / platformScores.length) : 0,
      totalViews,
      totalEngagements,
      totalFollowers,
      strongestPlatform: sorted[0]?.name || 'instagram',
      weakestPlatform: sorted[sorted.length - 1]?.name || 'instagram',
      crossPlatformRecommendations: [
        'Cross-post content across platforms for maximum reach',
        'Maintain consistent posting schedule across all platforms',
      ],
      platforms: data,
    };
  },
};
