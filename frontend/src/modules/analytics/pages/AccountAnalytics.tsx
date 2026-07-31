import React from 'react';
import { useAnalytics } from '../core/AnalyticsContext';
import { AnalyticsTabs } from '../components/layout/AnalyticsTabs';
import { OverviewTab } from './OverviewTab';
import { AIInsightsTab } from './AIInsightsTab';
import { AudienceTab } from './AudienceTab';
import { ContentAnalyticsTab } from './ContentAnalyticsTab';
import { ArrowLeft } from 'lucide-react';

export const AccountAnalytics: React.FC = () => {
  const { selectedAccount, activeTab, setView, setSelectedAccount } = useAnalytics();

  if (!selectedAccount) return null;

  return (
    <div className="space-y-6 mt-6">
      <button 
        onClick={() => {
          setSelectedAccount(null);
          setView('platform_summary');
        }} 
        className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Accounts
      </button>

      <div className="bg-bg-elevated border border-border rounded-2xl p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full border border-border overflow-hidden bg-bg-canvas">
          {selectedAccount.avatarUrl ? (
            <img src={selectedAccount.avatarUrl} alt={selectedAccount.username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-xl bg-gradient-to-tr from-brand-light to-brand text-white">
              {selectedAccount.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            {selectedAccount.username}
            {selectedAccount.isPremium && (
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white" title="Premium">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </h1>
          <p className="text-sm text-text-muted font-light capitalize">{selectedAccount.platform} Account Analytics</p>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <div className="text-xl font-bold">{selectedAccount.followers.toLocaleString()}</div>
            <div className="text-[10px] text-text-secondary uppercase tracking-widest font-medium">Followers</div>
          </div>
          <div>
            <div className={`text-xl font-bold ${selectedAccount.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {selectedAccount.growth > 0 ? '+' : ''}{selectedAccount.growth.toFixed(1)}%
            </div>
            <div className="text-[10px] text-text-secondary uppercase tracking-widest font-medium">Growth</div>
          </div>
          <div>
            <div className="text-xl font-bold">{selectedAccount.reach.toLocaleString()}</div>
            <div className="text-[10px] text-text-secondary uppercase tracking-widest font-medium">Reach</div>
          </div>
        </div>
      </div>

      <div className="bg-bg-canvas border border-border rounded-2xl overflow-hidden shadow-sm">
        <AnalyticsTabs />
        
        <div className="p-6 bg-bg-canvas">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'insights' && <AIInsightsTab />}
          {activeTab === 'audience' && <AudienceTab />}
          {activeTab === 'content' && <ContentAnalyticsTab />}
          {activeTab === 'reports' && (
            <div className="p-12 text-center text-text-muted bg-bg-elevated rounded-2xl border border-border">
              Reports generation coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
