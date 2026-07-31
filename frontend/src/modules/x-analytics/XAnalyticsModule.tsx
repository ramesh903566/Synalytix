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
import { cn } from '../../lib/utils';

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

        {/* Tabs Navigation */}
        <div className="flex space-x-6 border-b border-border mb-6 relative overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-4 text-sm font-medium transition-colors relative whitespace-nowrap",
                activeTab === tab.id ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
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
