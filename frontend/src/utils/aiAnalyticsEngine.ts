import { PlatformType, BaseMetrics, AIInsights, AIRecommendation, PlatformAnalyticsData, CrossPlatformInsights } from '../types/analytics';

export class UniversalAIEngine {
  /**
   * Generates AI Insights for a specific platform or account based on raw metrics.
   * This logic is identical across all platforms.
   */
  static generateInsights(metrics: BaseMetrics, previousMetrics?: BaseMetrics): AIInsights {
    // Mock calculations - in a real app, this would process raw metrics against historical data
    
    // Simulate some logic
    const growthTrend = metrics.followers && previousMetrics?.followers 
      ? (metrics.followers > previousMetrics.followers ? 'Improving' : 'Declining')
      : 'Stable';

    const healthScore = Math.min(100, Math.max(0, 75 + (metrics.engagements / Math.max(1, metrics.views)) * 100));

    return {
      healthScore: Math.round(healthScore),
      growthScore: 82,
      engagementScore: 78,
      reachScore: 85,
      consistencyScore: 90,
      audienceHealthScore: 88,
      
      postingFrequency: '3.2 times / week',
      topPerformingContentType: 'Video / Reels',
      growthTrend,
      
      recommendations: [
        {
          type: 'optimal_time',
          title: 'Optimal Posting Window',
          description: 'Your audience is most active Mon–Wed 18–21 IST.',
          impact: '+35% reach'
        },
        {
          type: 'content_mix',
          title: 'Format Shift',
          description: 'Video content drives 9x more views than static content.',
          impact: 'High'
        }
      ],
      
      summary: `Your performance is ${growthTrend.toLowerCase()}. Video content generated the majority of your engagement. Overall performance is Excellent.`
    };
  }

  /**
   * Generates Cross Platform Intelligence by analyzing all connected platforms.
   */
  static generateCrossPlatformInsights(platformsData: Record<PlatformType, PlatformAnalyticsData | null>): CrossPlatformInsights {
    let totalViews = 0;
    let totalEngagements = 0;
    let totalFollowers = 0;
    
    let strongestPlatform: PlatformType = 'instagram'; // Default fallback
    let maxEngagements = -1;

    let weakestPlatform: PlatformType = 'x'; // Default fallback
    let minEngagements = Infinity;

    Object.entries(platformsData).forEach(([platformKey, data]) => {
      if (data && data.aggregatedMetrics) {
        totalViews += data.aggregatedMetrics.views || 0;
        totalEngagements += data.aggregatedMetrics.engagements || 0;
        totalFollowers += data.aggregatedMetrics.followers || 0;

        if (data.aggregatedMetrics.engagements > maxEngagements) {
          maxEngagements = data.aggregatedMetrics.engagements;
          strongestPlatform = platformKey as PlatformType;
        }
        
        if (data.aggregatedMetrics.engagements < minEngagements) {
          minEngagements = data.aggregatedMetrics.engagements;
          weakestPlatform = platformKey as PlatformType;
        }
      }
    });

    return {
      overallHealthScore: 85, // Mock calculated
      totalViews,
      totalEngagements,
      totalFollowers,
      strongestPlatform,
      weakestPlatform,
      crossPlatformRecommendations: [
        `${strongestPlatform.charAt(0).toUpperCase() + strongestPlatform.slice(1)} drives the highest engagement.`,
        `Your overall creator growth increased by 18%.`,
        `Consider repurposing content from ${strongestPlatform} to ${weakestPlatform} to boost its performance.`
      ],
      platforms: platformsData
    };
  }
}
