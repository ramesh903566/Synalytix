import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GitCommit, GitPullRequest, MessageCircle, Star, GitMerge, AlertCircle, Clock } from 'lucide-react';
import { useGithubTimeline } from '../hooks/useGithubData';
import { GithubTimelineEvent } from '../types/github.types';

const EventIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'PushEvent': return <GitCommit className="w-4 h-4 text-blue-500" />;
    case 'PullRequestEvent': return <GitPullRequest className="w-4 h-4 text-emerald-500" />;
    case 'IssuesEvent': return <AlertCircle className="w-4 h-4 text-orange-500" />;
    case 'WatchEvent': return <Star className="w-4 h-4 text-yellow-500" />;
    case 'IssueCommentEvent': return <MessageCircle className="w-4 h-4 text-purple-500" />;
    default: return <GitMerge className="w-4 h-4 text-text-muted" />;
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export const ContributionTimeline: React.FC<{ username: string }> = ({ username }) => {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useGithubTimeline(username);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLoading || !hasNextPage) return;

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isLoading]);

  if (isLoading) {
    return <div className="w-full h-[400px] animate-pulse bg-bg-canvas rounded-3xl border border-border-light" />;
  }

  if (isError || !data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8 flex flex-col h-full max-h-[600px]"
    >
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-text-secondary" />
        <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 hide-scrollbar relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-bg-sunken" />
        
        <div className="flex flex-col gap-6">
          {data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.map((event: GithubTimelineEvent, j: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: j * 0.1 }}
                  key={event.id} 
                  className="flex gap-4 relative z-10"
                >
                  <div className="w-12 flex-shrink-0 flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border flex items-center justify-center">
                      <EventIcon type={event.type} />
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm text-text-secondary">
                      <span className="font-medium text-text-primary hover:text-blue-400 cursor-pointer transition-colors">
                        {event.repo}
                      </span>
                    </p>
                    <p className="text-sm text-text-secondary mt-1">{event.description}</p>
                    <p className="text-xs text-text-muted mt-2 font-mono">
                      {formatTimeAgo(event.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </React.Fragment>
          ))}
        </div>
        
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center mt-4">
          {isFetchingNextPage && <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
          {!hasNextPage && <span className="text-xs text-text-muted">End of timeline</span>}
        </div>
      </div>
    </motion.div>
  );
};
