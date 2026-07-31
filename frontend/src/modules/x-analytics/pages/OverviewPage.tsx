import React from 'react';
import { motion } from 'motion/react';
import { useXAnalyticsStore } from '../store/useXAnalyticsStore';
import { useOverviewKPIs, useAIInsights } from '../hooks/useXData';
import { MetricCard } from '../components/cards/MetricCard';
import { InsightCard } from '../components/cards/InsightCard';
import { ChartCard } from '../components/charts/ChartCard';
import { staggerContainer } from '../animations/variants';

const LazyOverviewAreaChart = React.lazy(() => import('../components/charts/OverviewAreaChart'));

export const OverviewPage: React.FC = () => {
  const { primaryMetric, setPrimaryMetric } = useXAnalyticsStore();
  
  const { data: rawKpis, isLoading: isLoadingKpis, error: kpiError } = useOverviewKPIs();
  const { data: insights, isLoading: isLoadingInsights } = useAIInsights(rawKpis);

  if (isLoadingKpis) {
    return <div className="h-96 flex items-center justify-center text-text-muted animate-pulse">Loading overview data...</div>;
  }

  if (kpiError || !rawKpis) {
    return <div className="h-96 flex items-center justify-center text-red-500">Failed to load overview data.</div>;
  }

  const kpis = [
    rawKpis.impressions,
    rawKpis.reach,
    rawKpis.followers,
    rawKpis.followerGrowth,
    rawKpis.profileVisits,
    rawKpis.likes,
    rawKpis.replies,
    rawKpis.reposts,
  ].filter(Boolean);

  const activeKpi = kpis.find(k => k.id === primaryMetric) || kpis[0];
  const chartData = activeKpi.history || [];

  return (
    <div className="space-y-8">
      {/* AI Insights Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold text-text-primary tracking-tight">AI Insights</h2>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400">Powered by Synalytix AI</span>
        </div>
        {isLoadingInsights ? (
          <div className="h-32 flex items-center justify-center text-text-muted animate-pulse bg-bg-elevated rounded-xl border border-border-light">
            Generating AI insights...
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {insights?.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </motion.div>
        )}
      </section>

      {/* KPI Grid Section */}
      <section>
        <h2 className="text-xl font-semibold text-text-primary tracking-tight mb-4">Performance Overview</h2>
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {kpis.map((kpi) => (
            <MetricCard 
              key={kpi.id} 
              kpi={kpi} 
              isActive={primaryMetric === kpi.id}
              onClick={() => setPrimaryMetric(kpi.id)}
            />
          ))}
        </motion.div>
      </section>

      {/* Main Chart Section */}
      <section>
        <ChartCard 
          title={`${activeKpi.label} over time`} 
          subtitle="Showing daily performance based on selected metric"
          className="h-[400px]"
        >
          <React.Suspense fallback={<div className="w-full h-full flex items-center justify-center text-text-muted animate-pulse">Loading chart...</div>}>
            <LazyOverviewAreaChart data={chartData} />
          </React.Suspense>
        </ChartCard>
      </section>
    </div>
  );
};
