import React from 'react';
import { Calendar, Download, RefreshCw, LayoutTemplate, Database } from 'lucide-react';
import { useXAnalyticsStore } from '../../store/useXAnalyticsStore';
import { DateRange } from '../../types/xAnalytics';
import { cn } from '../../utils/cn';

export const GlobalToolbar: React.FC = () => {
  const { dateRange, setDateRange, dataSourceMode, setDataSourceMode } = useXAnalyticsStore();
  
  const ranges: DateRange[] = ['7D', '2W', '4W', '3M', '1Y', 'Custom'];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 mb-6 border-b border-zinc-800/50">
      <div className="flex items-center gap-2">
        <button 
          aria-label="Select Custom Date"
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <Calendar className="w-4 h-4" />
        </button>
        <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-zinc-800/50">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              aria-pressed={dateRange === range}
              aria-label={`Set date range to ${range}`}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                dateRange === range 
                  ? "bg-white text-black shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <LayoutTemplate className="w-4 h-4" />
          <span>Saved Views</span>
        </button>
        <button
          onClick={() => setDataSourceMode(dataSourceMode === 'MOCK' ? 'LIVE' : 'MOCK')}
          className={cn(
            "flex items-center gap-2 px-3 py-2 border rounded-lg text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
            dataSourceMode === 'LIVE' 
              ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20" 
              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
          )}
        >
          <Database className="w-4 h-4" />
          <span>{dataSourceMode === 'LIVE' ? 'Live Data' : 'Mock Data'}</span>
        </button>
        <button 
          aria-label="Refresh Analytics Data"
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};
