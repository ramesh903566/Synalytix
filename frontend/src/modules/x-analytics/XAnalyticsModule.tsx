import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalToolbar } from './components/toolbar/GlobalToolbar';
import { OverviewPage } from './pages/OverviewPage';
import { AudiencePage } from './pages/AudiencePage';
import { ContentPage } from './pages/ContentPage';
import { VideoPage } from './pages/VideoPage';
import { LivePage } from './pages/LivePage';
import { SpacesPage } from './pages/SpacesPage';
import { AnalyticsErrorBoundary } from './components/shared/AnalyticsErrorBoundary';
import { ErrorBoundary } from 'react-error-boundary';
import { cn } from './utils/cn';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface XAnalyticsModuleProps {
  appInfo: any;
  account: any;
}

type TabType = 'overview' | 'audience' | 'content' | 'video' | 'live' | 'spaces';

export const XAnalyticsModule: React.FC<XAnalyticsModuleProps> = ({ appInfo, account }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'audience', label: 'Audience' },
    { id: 'content', label: 'Content' },
    { id: 'video', label: 'Video' },
    { id: 'live', label: 'Live' },
    { id: 'spaces', label: 'Spaces' },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'audience':
        return <AudiencePage />;
      case 'content':
        return <ContentPage />;
      case 'video':
        return <VideoPage />;
      case 'live':
        return <LivePage />;
      case 'spaces':
        return <SpacesPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full max-w-[1400px] mx-auto px-6 pb-24">
        {/* Account Info Header */}
        <div className="flex items-center gap-4 mb-8 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
          <img
            src={account.avatar}
            alt={account.handle}
            className="w-12 h-12 rounded-full border-2 border-zinc-800"
          />
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {account.handle}
              {account.isPremium && (
                <span className="bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                  Premium
                </span>
              )}
            </h2>
            <p className="text-sm text-zinc-400">Viewing analytics for {appInfo.name}</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-6 border-b border-zinc-800 mb-6 relative overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-4 text-sm font-medium transition-colors relative whitespace-nowrap",
                activeTab === tab.id ? "text-white" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabXAnalytics"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <GlobalToolbar />

        {/* Content Area */}
        <div className="mt-8 relative min-h-[600px]">
          <ErrorBoundary FallbackComponent={AnalyticsErrorBoundary} key={activeTab}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderActiveTab()}
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </div>
      </div>
    </QueryClientProvider>
  );
};
