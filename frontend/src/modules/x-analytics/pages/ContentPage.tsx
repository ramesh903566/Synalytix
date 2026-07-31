import React, { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { LayoutGrid, List } from 'lucide-react';
import { useContentPosts } from '../hooks/useXData';
import { ContentPost } from '../types/xAnalytics';
import { AnalyticsTable } from '../components/tables/AnalyticsTable';
import { cn } from '../../../lib/utils';

export const ContentPage: React.FC = () => {
  const [viewType, setViewType] = useState<'list' | 'grid'>('list');

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
        <div className="flex gap-1 bg-bg-elevated p-1 rounded-lg border border-border">
          <button
            onClick={() => setViewType('list')}
            className={`p-1.5 rounded-md transition-colors ${viewType === 'list' ? 'bg-bg-canvas text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewType('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewType === 'grid' ? 'bg-bg-canvas text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="h-96 flex items-center justify-center text-text-muted animate-pulse">Loading content data...</div>
      ) : error || !posts ? (
        <div className="h-96 flex items-center justify-center text-red-500">Failed to load content data.</div>
      ) : viewType === 'list' ? (
        <AnalyticsTable columns={columns} data={posts} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="p-4 bg-bg-canvas border border-border rounded-xl flex flex-col gap-3">
              <div className="flex justify-between items-start gap-2">
                <span className={cn(
                  "px-2 py-1 rounded text-xs w-fit",
                  post.status === 'Published' ? "bg-green-500/10 text-green-500" :
                  post.status === 'Scheduled' ? "bg-blue-500/10 text-blue-500" :
                  "bg-bg-sunken text-text-secondary"
                )}>
                  {post.status}
                </span>
                <span className="px-2 py-1 rounded bg-bg-sunken text-text-secondary text-xs">
                  {post.type}
                </span>
              </div>
              
              <div className="text-sm text-text-primary line-clamp-3">
                {post.content}
              </div>
              
              <div className="text-xs text-text-secondary mt-auto pt-3 border-t border-border">
                {format(new Date(post.publishedAt), 'MMM d, yyyy h:mm a')}
              </div>
              
              <div className="grid grid-cols-4 gap-2 pt-2 text-xs">
                <div className="flex flex-col">
                  <span className="text-text-secondary">Views</span>
                  <span className="font-medium">{post.impressions.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-text-secondary">Likes</span>
                  <span className="font-medium">{post.likes.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-text-secondary">Replies</span>
                  <span className="font-medium">{post.replies.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-text-secondary">Rate</span>
                  <span className="font-medium text-blue-400">{post.engagementRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
