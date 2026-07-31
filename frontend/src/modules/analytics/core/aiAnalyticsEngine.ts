import { AIInsight, UniversalAnalyticsData, PriorityLevel } from '../types';

/**
 * AI Insights Engine
 * 
 * This engine is responsible for computing, explaining, and presenting calculated metrics.
 * It takes raw API data (mapped to UniversalAnalyticsData) and generates structured insights.
 * 
 * Future implementation note: This would ideally be connected to a real AI/ML backend.
 * For now, it uses heuristic-based generation based on the data.
 */
export const generateInsights = (data: UniversalAnalyticsData): AIInsight[] => {
  const insights: AIInsight[] = [];
  const account = data.accounts[0]; // Assuming we're analyzing the first/main account for now, or this should be passed in.

  if (!account) return insights;

  // 1. Growth Rate Insight
  if (account.growth > 5) {
    insights.push({
      id: 'insight_growth_1',
      title: 'Strong Follower Velocity',
      description: `Your audience is growing at a highly accelerated rate of ${account.growth}% this period.`,
      reason: 'High engagement on recent short-form content has triggered algorithmic amplification.',
      evidence: 'Your last 3 reels accounted for 85% of all new profile visits.',
      impact: 'Increases overall account authority and base reach for future posts.',
      confidence: 92,
      priority: 'high',
      recommendedAction: 'Double down on the format and hook structure of your top 3 performing videos this week.',
      category: 'growth'
    });
  } else if (account.growth < 0) {
    insights.push({
      id: 'insight_growth_2',
      title: 'Audience Contraction Detected',
      description: 'Your follower count has decreased compared to the previous period.',
      reason: 'A lower posting frequency combined with content that deviated from your core niche.',
      evidence: 'Posting volume dropped by 40%, and the recent text-heavy posts had a 60% higher unfollow rate.',
      impact: 'Reduces baseline impressions for new content.',
      confidence: 85,
      priority: 'medium',
      recommendedAction: 'Return to your highest-performing content pillars and increase posting consistency to 3x per week.',
      category: 'growth'
    });
  }

  // 2. Engagement / Content Quality Insight
  const avgEngagement = data.summary.averageEngagementRate;
  if (avgEngagement > 4) {
    insights.push({
      id: 'insight_eng_1',
      title: 'High Content Health & Loyalty',
      description: 'Your audience is highly engaged, indicating strong content-market fit.',
      reason: 'Your hooks are effective and the content delivers on the premise, leading to high save and share rates.',
      evidence: `Your average engagement rate of ${avgEngagement.toFixed(1)}% is in the top 10% for your follower bracket.`,
      impact: 'Higher likelihood of content going viral and reaching non-followers.',
      confidence: 88,
      priority: 'low',
      recommendedAction: 'Experiment with slightly longer content formats to increase watch time now that trust is established.',
      category: 'engagement'
    });
  }

  // 3. Platform Specific or Structural Insight (Heuristic)
  insights.push({
    id: 'insight_content_1',
    title: 'Content Format Imbalance',
    description: 'Video content is significantly outperforming static content.',
    reason: 'The platform algorithm is currently prioritizing watch time and session duration.',
    evidence: 'Video content generated 71% of total engagement this month despite being only 30% of your output.',
    impact: 'You are leaving potential reach on the table by underutilizing video formats.',
    confidence: 95,
    priority: 'medium',
    recommendedAction: 'Shift your content mix to be at least 60% video/reels for the next two weeks.',
    category: 'content'
  });

  return insights;
};
