import React from 'react';
import { AnalyticsChart } from '../components/AnalyticsChart';
import { Heatmap } from '../components/Heatmap';
import { LinkedInAnalyticsService } from '../services';

export const Performance: React.FC = () => {
  const impressionsHistory = LinkedInAnalyticsService.getImpressionsHistory();
  const heatmapData = LinkedInAnalyticsService.getEngagementHeatmap();

  return (
    <div className="space-y-8 pb-12">
      <AnalyticsChart 
        title="Reach & Impressions"
        subtitle="Performance over time"
        data={impressionsHistory}
        dataKey="value"
        color="#8B5CF6"
        gradientId="perfGrad"
        height={400}
      />
      
      <Heatmap data={heatmapData.flat()} />
    </div>
  );
};
