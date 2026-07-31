import React, { useEffect } from 'react';
import { AnalyticsProvider, useAnalytics } from './core/AnalyticsContext';
import { UniversalAnalyticsData } from './types';
import { PlatformSummary } from './pages/PlatformSummary';
import { ConnectedAccounts } from './pages/ConnectedAccounts';
import { AccountAnalytics } from './pages/AccountAnalytics';
import { ContentDetailDrawer } from './components/drawers/ContentDetailDrawer';

interface UniversalAnalyticsProps {
  data: UniversalAnalyticsData;
}

const AnalyticsRoot: React.FC<UniversalAnalyticsProps> = ({ data }) => {
  const { setData, view } = useAnalytics();

  useEffect(() => {
    setData(data);
  }, [data, setData]);

  return (
    <div className="w-full">
      {view === 'platform_summary' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PlatformSummary />
          <ConnectedAccounts />
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <AccountAnalytics />
        </div>
      )}
      
      <ContentDetailDrawer />
    </div>
  );
};

export const UniversalAnalytics: React.FC<UniversalAnalyticsProps> = (props) => {
  return (
    <AnalyticsProvider>
      <AnalyticsRoot {...props} />
    </AnalyticsProvider>
  );
};
