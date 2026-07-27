import { create } from 'zustand';
import { DateRange, ChartType } from '../types/xAnalytics';

interface XAnalyticsState {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  
  primaryMetric: string;
  setPrimaryMetric: (metric: string) => void;
  
  secondaryMetric: string | null;
  setSecondaryMetric: (metric: string | null) => void;
  
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
  
  dataSourceMode: 'MOCK' | 'LIVE';
  setDataSourceMode: (mode: 'MOCK' | 'LIVE') => void;
}

export const useXAnalyticsStore = create<XAnalyticsState>((set) => ({
  dateRange: '7D',
  setDateRange: (range) => set({ dateRange: range }),
  
  primaryMetric: 'impressions',
  setPrimaryMetric: (metric) => set({ primaryMetric: metric }),
  
  secondaryMetric: null,
  setSecondaryMetric: (metric) => set({ secondaryMetric: metric }),
  
  chartType: 'area',
  setChartType: (type) => set({ chartType: type }),
  
  dataSourceMode: 'MOCK',
  setDataSourceMode: (mode) => set({ dataSourceMode: mode }),
}));
