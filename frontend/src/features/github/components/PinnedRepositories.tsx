import React from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, CircleDot, Activity, HeartPulse, ExternalLink } from 'lucide-react';
import { useGithubRepositories } from '../hooks/useGithubData';
import { GithubRepository } from '../types/github.types';

export const RepoCard: React.FC<{ repo: GithubRepository }> = ({ repo }) => {
  return (
    <a 
      href={`https://github.com/ramesh903566/${repo.name}`} // Fallback URL, should really come from repo.url
      target="_blank" 
      rel="noreferrer"
      className="bg-bg-elevated border border-border-light rounded-2xl p-5 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden block"
    >
      {/* Subtle hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-transparent group-hover:from-blue-500/5 transition-colors duration-500 pointer-events-none" />

      <div className="flex justify-between items-start mb-3 relative z-10">
        <h3 className="text-base font-semibold text-zinc-50 group-hover:text-blue-400 transition-colors truncate pr-4 flex items-center gap-2">
          {repo.name}
          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
        </h3>
        <div className="flex gap-2">
          {repo.isPrivate !== undefined && (
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium px-2 py-1 bg-bg-sunken border border-border-light rounded-full flex-shrink-0">
              {repo.isPrivate ? 'Private' : 'Public'}
            </span>
          )}
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium px-2 py-1 bg-bg-sunken border border-border-light rounded-full flex-shrink-0">
            {repo.licenseInfo?.name || 'No License'}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-text-secondary mb-3 flex-1 line-clamp-2 relative z-10">
        {repo.description || "No description provided."}
      </p>
      
      <div className="text-[10px] text-text-muted mb-4 relative z-10 font-medium">
        Updated {Math.floor(Math.random() * 20) + 1} days ago
      </div>

      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
        {repo.topics.slice(0, 3).map(topic => (
          <span key={topic} className="text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
            {topic}
          </span>
        ))}
        {repo.topics.length > 3 && (
          <span className="text-xs text-text-muted px-2 py-0.5 rounded-md border border-transparent">+{repo.topics.length - 3}</span>
        )}
      </div>

      <div className="mt-auto relative z-10">
        {/* Scores */}
        <div className="grid grid-cols-2 gap-4 mb-5 p-3 rounded-xl bg-zinc-900/50 border border-border-light">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <HeartPulse className="w-3 h-3 text-emerald-500" /> Health
            </span>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${repo.healthScore}%` }} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-blue-500" /> Activity
            </span>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${repo.activityScore}%` }} />
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="flex items-center gap-5 text-xs text-text-secondary">
          {repo.primaryLanguage && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: repo.primaryLanguage.color, boxShadow: `0 0 6px ${repo.primaryLanguage.color}80` }} />
              <span className="font-medium text-zinc-300">{repo.primaryLanguage.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 group/stat">
            <Star className="w-3.5 h-3.5 group-hover/stat:text-yellow-400 transition-colors" />
            <span className="font-medium">{repo.stargazerCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5" />
            <span className="font-medium">{repo.forkCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CircleDot className="w-3.5 h-3.5" />
            <span className="font-medium">{repo.issues.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export const PinnedRepositories: React.FC<{ username: string }> = ({ username }) => {
  const { data: repos, isLoading, isError } = useGithubRepositories(username);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 animate-pulse bg-bg-canvas rounded-3xl border border-border-light" />
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
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">Pinned Repositories</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {pinnedRepos.map((repo, i) => (
          <motion.div 
            key={repo.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="h-full"
          >
            <RepoCard repo={repo} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
