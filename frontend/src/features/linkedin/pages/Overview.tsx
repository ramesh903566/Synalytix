import React from 'react';
import { Eye, Search, Users, Activity } from 'lucide-react';
import { KPICard } from '../components/KPICard';
import { AnalyticsChart } from '../components/AnalyticsChart';
import { InsightCard } from '../components/InsightCard';
import { PremiumScoreCard } from '../components/PremiumScoreCard';
import { motion } from 'framer-motion';
import { AIInsightsService, LinkedInAnalyticsService } from '../services';

export const Overview: React.FC = () => {
  const overviewMetrics = LinkedInAnalyticsService.getOverviewMetrics();
  const impressionsHistory = LinkedInAnalyticsService.getImpressionsHistory();
  const aiInsights = AIInsightsService.getInsights();
  const premiumScores = AIInsightsService.getPremiumScores();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* Premium Score */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PremiumScoreCard 
            title={premiumScores.aiGrowthScore.title}
            description={premiumScores.aiGrowthScore.description}
            score={premiumScores.aiGrowthScore.score}
            trend={premiumScores.aiGrowthScore.trend}
          />
        </div>
        <div className="lg:col-span-2 bg-gradient-to-r from-[#0A66C2]/10 to-transparent border border-[#0A66C2]/20 rounded-2xl p-6 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-text-primary mb-2">AI Growth Trajectory Estimate</h3>
          <p className="text-text-secondary">This score is modeled from engagement rate, follower velocity, and profile view growth. Current support: {overviewMetrics.contentMixLeader}.</p>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Impressions"
          value={overviewMetrics.impressions.toLocaleString()}
          trend={overviewMetrics.impressionsGrowth}
          icon={Eye}
          sparklineData={impressionsHistory.slice(-7).map(d => ({ val: d.value }))}
          insight={overviewMetrics.contentMixLeader}
        />
        <KPICard 
          title="Profile Views"
          value={overviewMetrics.profileViews.toLocaleString()}
          trend={overviewMetrics.profileViewsGrowth}
          icon={Users}
        />
        <KPICard 
          title="Search Appearances"
          value={overviewMetrics.searchAppearances.toLocaleString()}
          trend={overviewMetrics.searchAppearancesGrowth}
          icon={Search}
        />
        <KPICard 
          title="Engagement Rate"
          value={`${overviewMetrics.engagementRate}%`}
          trend={0.5}
          icon={Activity}
        />
      </motion.div>

      {/* Main Chart */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart 
            title="Impressions History"
            subtitle="Daily impressions over the last 30 days"
            data={impressionsHistory}
            dataKey="value"
            color="#0A66C2"
            gradientId="impressionsGrad"
            height={350}
          />
        </div>
        
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-text-primary">Top Insights</h3>
          <div className="space-y-4">
            {aiInsights.slice(0, 3).map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
