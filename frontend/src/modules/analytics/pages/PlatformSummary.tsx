import React from 'react';
import { useAnalytics } from '../core/AnalyticsContext';

export const PlatformSummary: React.FC = () => {
  const { data } = useAnalytics();
  
  if (!data) return null;
  const { summary } = data;

  const summaryCards = [
    { label: 'Total Connected Accounts', value: summary.totalConnectedAccounts },
    { label: 'Combined Followers', value: summary.combinedFollowers.toLocaleString() },
    { label: 'Combined Reach', value: summary.combinedReach.toLocaleString() },
    { label: 'Combined Engagement', value: summary.combinedEngagement.toLocaleString() },
    { label: 'Average Engagement Rate', value: `${summary.averageEngagementRate.toFixed(1)}%` },
    { label: 'Average Growth', value: `${summary.averageGrowth > 0 ? '+' : ''}${summary.averageGrowth.toFixed(1)}%` },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Platform Summary: {data.platformName}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {summaryCards.map((card, idx) => (
            <div key={idx} className="bg-bg-elevated border border-border p-5 rounded-2xl flex flex-col justify-center">
              <span className="text-xs text-text-muted font-medium mb-2 uppercase tracking-wider">{card.label}</span>
              <span className="text-2xl font-bold text-text-primary">{card.value}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary.topPerformingAccount && (
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Top Performing Account</h3>
            <span className="text-xl font-bold text-blue-950">{summary.topPerformingAccount}</span>
          </div>
        )}
        {summary.fastestGrowingAccount && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-green-800 uppercase tracking-wider mb-2">Fastest Growing</h3>
            <span className="text-xl font-bold text-green-950">{summary.fastestGrowingAccount}</span>
          </div>
        )}
        {summary.mostConsistentAccount && (
          <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-100 p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">Most Consistent</h3>
            <span className="text-xl font-bold text-purple-950">{summary.mostConsistentAccount}</span>
          </div>
        )}
        <div className="bg-gradient-to-br from-zinc-800 to-black border border-zinc-700 p-5 rounded-2xl text-white">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Overall Health Score</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{summary.healthScore}</span>
            <span className="text-sm font-medium text-zinc-500 mb-1">/ 100</span>
          </div>
        </div>
      </div>
    </div>
  );
};
