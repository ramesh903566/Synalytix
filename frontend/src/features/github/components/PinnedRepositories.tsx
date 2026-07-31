import React from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, CircleDot, Activity, HeartPulse } from 'lucide-react';
import { useGithubRepositories } from '../hooks/useGithubData';
import { GithubRepository } from '../types/github.types';

const RepoCard: React.FC<{ repo: GithubRepository }> = ({ repo }) => {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all cursor-pointer group flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-base font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors truncate pr-4">
          {repo.name}
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-full flex-shrink-0">
          {repo.licenseInfo?.name || 'No License'}
        </span>
      </div>
      
      <p className="text-sm text-zinc-400 mb-6 flex-1 line-clamp-2">
        {repo.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {repo.topics.slice(0, 3).map(topic => (
          <span key={topic} className="text-xs text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded-md">
            {topic}
          </span>
        ))}
        {repo.topics.length > 3 && (
          <span className="text-xs text-zinc-500 px-2 py-0.5 rounded-md">+{repo.topics.length - 3}</span>
        )}
      </div>

      <div className="mt-auto">
        {/* Scores */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
              <HeartPulse className="w-3 h-3" /> Health
            </span>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${repo.healthScore}%` }} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3" /> Activity
            </span>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${repo.activityScore}%` }} />
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="flex items-center gap-4 text-xs text-zinc-400">
          {repo.primaryLanguage && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: repo.primaryLanguage.color }} />
              <span>{repo.primaryLanguage.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5" />
            <span>{repo.stargazerCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5" />
            <span>{repo.forkCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <CircleDot className="w-3.5 h-3.5" />
            <span>{repo.issues.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PinnedRepositories: React.FC<{ username: string }> = ({ username }) => {
  const { data: repos, isLoading, isError } = useGithubRepositories(username);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 animate-pulse bg-zinc-950 rounded-3xl border border-zinc-800/50" />
        ))}
      </div>
    );
  }

  if (isError || !repos) return null;

  // Simulate pinned repos by taking the top 3 by stars
  const pinnedRepos = [...repos].sort((a, b) => b.stargazerCount - a.stargazerCount).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-950 border border-zinc-800/50 rounded-3xl p-6 lg:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-zinc-100">Top Repositories</h2>
        <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          View all
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {pinnedRepos.map((repo, i) => (
          <motion.div 
            key={repo.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <RepoCard repo={repo} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
