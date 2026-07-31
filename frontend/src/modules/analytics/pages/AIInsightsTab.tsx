import React, { useMemo } from 'react';
import { useAnalytics } from '../core/AnalyticsContext';
import { InsightCard } from '../components/cards/InsightCard';
import { generateInsights } from '../core/aiAnalyticsEngine';

export const AIInsightsTab: React.FC = () => {
  const { data } = useAnalytics();
  
  // Use dynamically generated insights from our engine, falling back to static mock data if the engine didn't generate any.
  const insights = useMemo(() => {
    if (!data) return [];
    const generated = generateInsights(data);
    return generated.length > 0 ? generated : (data.selectedAccountInsights || []);
  }, [data]);

  if (insights.length === 0) {
    return (
      <div className="p-12 text-center text-text-muted bg-bg-elevated rounded-2xl border border-border">
        No insights generated for this period.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">AI Analytics Engine</h2>
          <p className="text-sm text-text-muted">Calculated metrics, anomaly detection, and recommended actions.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
};
