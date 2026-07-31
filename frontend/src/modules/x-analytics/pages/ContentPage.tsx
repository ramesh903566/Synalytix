import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useContentPosts } from '../hooks/useXData';
import { ContentPost } from '../types/xAnalytics';
import { AnalyticsTable } from '../components/tables/AnalyticsTable';
import { cn } from '../utils/cn';

export const ContentPage: React.FC = () => {
  const columns = useMemo<ColumnDef<ContentPost>[]>(
    () => [
      {
        accessorKey: 'content',
        header: 'Post',
        cell: (info) => (
          <div className="max-w-xs truncate text-text-primary">
            {info.getValue<string>()}
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: (info) => {
          const val = info.getValue<string>();
          return (
            <span className="px-2 py-1 rounded bg-bg-sunken text-text-secondary text-xs">
              {val}
            </span>
          );
        },
      },
      {
        accessorKey: 'publishedAt',
        header: 'Published Date',
        cell: (info) => (
          <span className="text-text-secondary">
            {format(new Date(info.getValue<string>()), 'MMM d, yyyy h:mm a')}
          </span>
        ),
      },
      {
        accessorKey: 'impressions',
        header: 'Impressions',
        cell: (info) => info.getValue<number>().toLocaleString(),
      },
      {
        accessorKey: 'likes',
        header: 'Likes',
        cell: (info) => info.getValue<number>().toLocaleString(),
      },
      {
        accessorKey: 'replies',
        header: 'Replies',
        cell: (info) => info.getValue<number>().toLocaleString(),
      },
      {
        accessorKey: 'reposts',
        header: 'Reposts',
        cell: (info) => info.getValue<number>().toLocaleString(),
      },
      {
        accessorKey: 'engagementRate',
        header: 'Engagement Rate',
        cell: (info) => (
          <span className="text-blue-400">
            {info.getValue<number>()}%
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const val = info.getValue<string>();
          return (
            <span className={cn(
              "px-2 py-1 rounded text-xs",
              val === 'Published' ? "bg-green-500/10 text-green-500" :
              val === 'Scheduled' ? "bg-blue-500/10 text-blue-500" :
              "bg-bg-canvas text-text-secondary"
            )}>
              {val}
            </span>
          );
        },
      },
    ],
    []
  );

  const { data: posts, isLoading, error } = useContentPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary tracking-tight">Content Performance</h2>
      </div>
      {isLoading ? (
        <div className="h-96 flex items-center justify-center text-text-muted animate-pulse">Loading content data...</div>
      ) : error || !posts ? (
        <div className="h-96 flex items-center justify-center text-red-500">Failed to load content data.</div>
      ) : (
        <AnalyticsTable columns={columns} data={posts} />
      )}
    </div>
  );
};
