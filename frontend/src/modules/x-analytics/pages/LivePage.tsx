import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useLiveBroadcasts } from '../hooks/useXData';
import { LiveBroadcast } from '../types/xAnalytics';
import { AnalyticsTable } from '../components/tables/AnalyticsTable';
import { cn } from '../../../lib/utils';

export const LivePage: React.FC = () => {
  const columns = useMemo<ColumnDef<LiveBroadcast>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Broadcast',
        cell: (info) => (
          <div className="font-medium text-text-primary truncate max-w-[200px]">
            {info.getValue<string>()}
          </div>
        ),
      },
      {
        accessorKey: 'startedAt',
        header: 'Date',
        cell: (info) => (
          <span className="text-text-secondary">
            {format(new Date(info.getValue<string>()), 'MMM d, yyyy')}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue<string>();
          return (
            <span className={cn(
              "px-2 py-1 rounded text-xs font-medium",
              status === 'Live' ? "bg-red-500/10 text-red-500" :
              status === 'Ended' ? "bg-bg-sunken text-text-secondary" :
              "bg-blue-500/10 text-blue-500"
            )}>
              {status === 'Live' ? '🔴 Live' : status}
            </span>
          );
        },
      },
      {
        accessorKey: 'peakViewers',
        header: 'Peak Viewers',
        cell: (info) => info.getValue<number>().toLocaleString(),
      },
      {
        accessorKey: 'avgWatchTimeMinutes',
        header: 'Avg Watch Time (min)',
        cell: (info) => info.getValue<number>(),
      },
      {
        accessorKey: 'durationMinutes',
        header: 'Duration (min)',
        cell: (info) => info.getValue<number>(),
      },
      {
        accessorKey: 'replayViews',
        header: 'Replay Views',
        cell: (info) => info.getValue<number>().toLocaleString(),
      },
    ],
    []
  );

  const { data: broadcasts, isLoading, error } = useLiveBroadcasts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary tracking-tight">Live Broadcasts</h2>
      </div>

      {isLoading ? (
        <div className="h-96 flex items-center justify-center text-text-muted animate-pulse">Loading live data...</div>
      ) : error || !broadcasts ? (
        <div className="h-96 flex items-center justify-center text-red-500">Failed to load live data.</div>
      ) : (
        <div className="bg-bg-elevated border border-border-light rounded-xl overflow-hidden backdrop-blur-sm shadow-xl p-1">
          <AnalyticsTable columns={columns} data={broadcasts} />
        </div>
      )}
    </div>
  );
};
