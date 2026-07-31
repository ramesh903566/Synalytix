import React from 'react';
import { useAnalytics } from '../core/AnalyticsContext';
import { KPIDashboard } from '../components/cards/KPIDashboard';

export const OverviewTab: React.FC = () => {
  const { data } = useAnalytics();
  
  if (!data?.selectedAccountOverview) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Key Performance Indicators</h2>
          <p className="text-sm text-text-muted">A top-level overview of your account's health this period.</p>
        </div>
      </div>
      
      <KPIDashboard metrics={data.selectedAccountOverview} />
    </div>
  );
};
