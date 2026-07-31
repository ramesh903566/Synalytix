import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useVideoStats } from '../hooks/useXData';
import { VideoStats } from '../types/xAnalytics';
import { AnalyticsTable } from '../components/tables/AnalyticsTable';
import { ChartCard } from '../components/charts/ChartCard';
import { motion } from 'motion/react';
import { staggerContainer } from '../animations/variants';

export const VideoPage: React.FC = () => {
  const columns = useMemo<ColumnDef<VideoStats>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Video',
        cell: (info) => (
          <div className="max-w-xs truncate font-medium text-text-primary">
            {info.getValue<string>()}
          </div>
        ),
      },
      {
        accessorKey: 'publishedAt',
        header: 'Published Date',
        cell: (info) => (
          <span className="text-text-secondary">
            {format(new Date(info.getValue<string>()), 'MMM d, yyyy')}
          </span>
        ),
      },
      {
        accessorKey: 'views',
        header: 'Views',
        cell: (info) => <span className="font-semibold text-text-primary">{info.getValue<number>().toLocaleString()}</span>,
      },
      {
        accessorKey: 'watchTimeHours',
        header: 'Watch Time (Hrs)',
        cell: (info) => info.getValue<number>().toLocaleString(),
      },
      {
        accessorKey: 'completionRate',
        header: 'Completion Rate',
        cell: (info) => (
          <span className="text-blue-400">
            {info.getValue<number>()}%
          </span>
        ),
      },
      {
        accessorKey: 'performanceScore',
        header: 'Score',
        cell: (info) => {
          const score = info.getValue<number>();
          return (
            <span className={`px-2 py-1 rounded text-xs ${score >= 90 ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
              {score}
            </span>
          );
        },
      },
    ],
    []
  );

  const { data: videos, isLoading, error } = useVideoStats();

  const aggregates = useMemo(() => {
    if (!videos || videos.length === 0) return { views: 0, watchTime: 0, avgDuration: '00:00', completion: 0 };
    const totalViews = videos.reduce((acc, v) => acc + v.views, 0);
    const totalWatchTime = videos.reduce((acc, v) => acc + v.watchTimeHours, 0);
    const avgDuration = Math.round(videos.reduce((acc, v) => acc + v.avgWatchDurationSeconds, 0) / videos.length);
    const avgCompletion = Math.round(videos.reduce((acc, v) => acc + v.completionRate, 0) / videos.length);
    
    const minutes = Math.floor(avgDuration / 60);
    const seconds = avgDuration % 60;
    
    return {
      views: totalViews >= 1000 ? `${(totalViews/1000).toFixed(1)}K` : totalViews.toString(),
      watchTime: totalWatchTime >= 1000 ? `${(totalWatchTime/1000).toFixed(1)}K` : totalWatchTime.toString(),
      avgDuration: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      completion: avgCompletion
    };
  }, [videos]);

  if (isLoading) {
    return <div className="h-96 flex items-center justify-center text-text-muted animate-pulse">Loading video data...</div>;
  }

  if (error || !videos) {
    return <div className="h-96 flex items-center justify-center text-red-500">Failed to load video data.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary tracking-tight">Video Performance</h2>
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-bg-elevated border border-border-light rounded-xl p-5 backdrop-blur-sm">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Total Views</h4>
          <span className="text-3xl font-bold text-text-primary">{aggregates.views}</span>
        </div>
        <div className="bg-bg-elevated border border-border-light rounded-xl p-5 backdrop-blur-sm">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Watch Time</h4>
          <span className="text-3xl font-bold text-text-primary">{aggregates.watchTime} <span className="text-lg text-text-muted">hrs</span></span>
        </div>
        <div className="bg-bg-elevated border border-border-light rounded-xl p-5 backdrop-blur-sm">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Avg Duration</h4>
          <span className="text-3xl font-bold text-text-primary">{aggregates.avgDuration}</span>
        </div>
        <div className="bg-bg-elevated border border-border-light rounded-xl p-5 backdrop-blur-sm">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Completion Rate</h4>
          <span className="text-3xl font-bold text-blue-400">{aggregates.completion}%</span>
        </div>
      </motion.div>

      <ChartCard title="Video Completion Funnel" className="h-[250px]">
        {/* Simplified funnel representation */}
        <div className="relative h-32 w-full border-b border-border-light flex items-end mt-4">
          <div className="absolute left-[10%] w-[15%] h-[90%] bg-blue-500/80 rounded-t-sm"></div>
          <div className="absolute left-[30%] w-[15%] h-[65%] bg-blue-500/60 rounded-t-sm"></div>
          <div className="absolute left-[50%] w-[15%] h-[48%] bg-blue-500/40 rounded-t-sm"></div>
          <div className="absolute left-[70%] w-[15%] h-[35%] bg-blue-500/20 rounded-t-sm"></div>
        </div>
        <div className="flex justify-between text-xs text-text-muted mt-3 px-10">
          <span>Start</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>Complete</span>
        </div>
      </ChartCard>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-text-primary mb-4">Top Videos</h3>
        <AnalyticsTable columns={columns} data={videos} />
      </div>
    </div>
  );
};
