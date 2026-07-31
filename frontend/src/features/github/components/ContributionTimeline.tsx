import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GitCommit, GitPullRequest, MessageCircle, Star, GitMerge, AlertCircle, Clock } from 'lucide-react';
import { useGithubTimeline } from '../hooks/useGithubData';
import { GithubTimelineEvent } from '../types/github.types';

const EventIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'PushEvent': return <GitCommit className="w-4 h-4 text-blue-400" />;
    case 'PullRequestEvent': return <GitPullRequest className="w-4 h-4 text-emerald-400" />;
    case 'IssuesEvent': return <AlertCircle className="w-4 h-4 text-amber-400" />;
    case 'WatchEvent': return <Star className="w-4 h-4 text-yellow-400" />;
    case 'IssueCommentEvent': return <MessageCircle className="w-4 h-4 text-purple-400" />;
    default: return <GitMerge className="w-4 h-4 text-zinc-400" />;
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
    return <div className="w-full h-[500px] animate-pulse bg-bg-canvas rounded-3xl border border-border-light" />;
  }

  if (isError || !data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8 flex flex-col h-full max-h-[700px] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <Clock className="w-5 h-5 text-emerald-400" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">Recent Activity</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent hover:scrollbar-thumb-zinc-600 relative z-10">
        <div className="absolute left-7 top-4 bottom-0 w-px bg-gradient-to-b from-zinc-800 via-zinc-800 to-transparent" />
        
        <div className="flex flex-col gap-8 pb-4">
          {data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.map((event: GithubTimelineEvent, j: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (i * 0.1) + (j * 0.05), ease: "easeOut" }}
                  key={event.id} 
                  className="flex gap-5 relative group"
                >
                  <div className="w-14 flex-shrink-0 flex justify-center relative">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-zinc-800 group-hover:border-zinc-600 flex items-center justify-center transition-colors shadow-lg z-10">
                      <EventIcon type={event.type} />
                    </div>
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-blue-500/0 rounded-full blur-md group-hover:bg-blue-500/20 transition-colors pointer-events-none z-0" />
                  </div>
                  
                  <div className="flex-1 pt-1 bg-zinc-900/30 border border-transparent group-hover:border-zinc-800 group-hover:bg-zinc-900/50 p-4 rounded-2xl transition-all -mt-3">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-semibold text-zinc-300">
                        <span className="text-zinc-100 hover:text-blue-400 cursor-pointer transition-colors">
                          {event.repo}
                        </span>
                      </p>
                      <p className="text-xs text-zinc-500 font-mono bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
                        {formatTimeAgo(event.timestamp)}
                      </p>
                    </div>
                    <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </React.Fragment>
          ))}
        </div>
        
        <div ref={loadMoreRef} className="h-16 flex items-center justify-center mt-4">
          {isFetchingNextPage && <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
          {!hasNextPage && <span className="text-xs font-medium text-zinc-500 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">End of timeline</span>}
        </div>
      </div>
    </motion.div>
  );
};
