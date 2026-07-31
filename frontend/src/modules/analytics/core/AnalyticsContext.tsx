import React, { createContext, useContext, useState, useMemo } from 'react';
import { UniversalAnalyticsData, ConnectedAccount, ContentItem } from '../types';

interface AnalyticsContextValue {
  data: UniversalAnalyticsData | null;
  setData: (data: UniversalAnalyticsData) => void;
  
  // Navigation State
  view: 'platform_summary' | 'account_detail';
  setView: (view: 'platform_summary' | 'account_detail') => void;
  
  selectedAccount: ConnectedAccount | null;
  setSelectedAccount: (account: ConnectedAccount | null) => void;
  
  selectedContentItem: ContentItem | null;
  setSelectedContentItem: (item: ContentItem | null) => void;
  
  activeTab: 'overview' | 'insights' | 'audience' | 'content' | 'reports';
  setActiveTab: (tab: 'overview' | 'insights' | 'audience' | 'content' | 'reports') => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<UniversalAnalyticsData | null>(null);
  const [view, setView] = useState<'platform_summary' | 'account_detail'>('platform_summary');
  const [selectedAccount, setSelectedAccount] = useState<ConnectedAccount | null>(null);
  const [selectedContentItem, setSelectedContentItem] = useState<ContentItem | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'audience' | 'content' | 'reports'>('overview');

  const value = useMemo(() => ({
    data,
    setData,
    view,
    setView,
    selectedAccount,
    setSelectedAccount,
    selectedContentItem,
    setSelectedContentItem,
    activeTab,
    setActiveTab,
  }), [data, view, selectedAccount, selectedContentItem, activeTab]);

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
