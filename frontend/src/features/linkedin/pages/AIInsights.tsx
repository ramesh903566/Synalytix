import React from 'react';
import { RecommendationCard } from '../components/RecommendationCard';
import { InsightCard } from '../components/InsightCard';
import { PremiumScoreCard } from '../components/PremiumScoreCard';
import { Sparkles } from 'lucide-react';
import { AIInsightsService } from '../services';

export const AIInsights: React.FC = () => {
  const aiInsights = AIInsightsService.getInsights();
  const premiumScores = AIInsightsService.getPremiumScores();
  const recommendations = aiInsights.filter(i => i.type === 'action');
  const otherInsights = aiInsights.filter(i => i.type !== 'action');

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-gradient-to-br from-[#0A66C2]/20 to-transparent border border-[#0A66C2]/30 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#0A66C2] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">AI Analyst</h2>
        </div>
        <p className="text-zinc-300 max-w-2xl text-sm leading-relaxed">
          AI estimates are generated from obtainable LinkedIn metrics such as impressions, reactions, comments, shares,
          clicks, follower trend, publish time, and audience demographics. Each recommendation includes supporting metrics and confidence.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-6">Premium AI Scores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PremiumScoreCard 
            title={premiumScores.audienceQualityScore.title}
            description={premiumScores.audienceQualityScore.description}
            score={premiumScores.audienceQualityScore.score}
            trend={premiumScores.audienceQualityScore.trend}
          />
          <PremiumScoreCard 
            title={premiumScores.postingHabitScore.title}
            description={premiumScores.postingHabitScore.description}
            score={premiumScores.postingHabitScore.score}
            trend={premiumScores.postingHabitScore.trend}
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-6">Actionable Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map(rec => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-6">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherInsights.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </div>
  );
};
