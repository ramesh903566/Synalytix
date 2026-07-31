import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useSpaces } from '../hooks/useXData';
import { Space } from '../types/xAnalytics';
import { AnalyticsTable } from '../components/tables/AnalyticsTable';
import { cn } from '../../../lib/utils';

export const SpacesPage: React.FC = () => {
  const columns = useMemo<ColumnDef<Space>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Space Title',
        cell: (info) => (
          <div className="font-medium text-text-primary truncate max-w-[200px]">
            {info.getValue<string>()}
          </div>
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
              status === 'Live' ? "bg-purple-500/20 text-purple-400" :
              status === 'Ended' ? "bg-bg-sunken text-text-secondary" :
              "bg-blue-500/10 text-blue-500"
            )}>
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'scheduledFor',
        header: 'Date/Time',
        cell: (info) => {
          const val = info.getValue<string | undefined>();
          return val ? (
            <span className="text-text-secondary">
              {format(new Date(val), 'MMM d, h:mm a')}
            </span>
          ) : (
            <span className="text-text-muted">-</span>
          );
        },
      },
      {
        accessorKey: 'listeners',
        header: 'Total Listeners',
        cell: (info) => info.getValue<number>() > 0 ? info.getValue<number>().toLocaleString() : '-',
      },
      {
        accessorKey: 'peakListeners',
        header: 'Peak Listeners',
        cell: (info) => info.getValue<number>() > 0 ? info.getValue<number>().toLocaleString() : '-',
      },
      {
        accessorKey: 'speakersCount',
        header: 'Speakers',
        cell: (info) => info.getValue<number>() || '-',
      },
      {
        accessorKey: 'durationMinutes',
        header: 'Duration (min)',
        cell: (info) => info.getValue<number>() || '-',
      },
      {
        accessorKey: 'retentionRate',
        header: 'Retention',
        cell: (info) => info.getValue<number>() > 0 ? `${info.getValue<number>()}%` : '-',
      },
    ],
    []
  );

  const { data: spaces, isLoading, error } = useSpaces();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary tracking-tight">Spaces Analytics</h2>
      </div>

      {isLoading ? (
        <div className="h-96 flex items-center justify-center text-text-muted animate-pulse">Loading spaces data...</div>
      ) : error || !spaces ? (
        <div className="h-96 flex items-center justify-center text-red-500">Failed to load spaces data.</div>
      ) : (
        <div className="bg-bg-elevated border border-border-light rounded-xl overflow-hidden backdrop-blur-sm shadow-xl p-1">
          <AnalyticsTable columns={columns} data={spaces} />
        </div>
      )}
    </div>
  );
};
