import React from 'react';
import { useAnalytics } from '../../core/AnalyticsContext';

export const AnalyticsTabs: React.FC = () => {
  const { activeTab, setActiveTab } = useAnalytics();

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'insights', label: 'AI Insights' },
    { id: 'audience', label: 'Audience' },
    { id: 'content', label: 'Content' },
    { id: 'reports', label: 'Reports' },
  ] as const;

  return (
    <div className="flex border-b border-border-light overflow-x-auto no-scrollbar">
      {tabs.map(tab => (
        <button 
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-8 py-4 text-sm font-medium capitalize relative transition-colors whitespace-nowrap
            ${activeTab === tab.id 
              ? 'text-text-primary' 
              : 'text-text-secondary hover:text-text-muted'
            }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
      ))}
    </div>
  );
};
