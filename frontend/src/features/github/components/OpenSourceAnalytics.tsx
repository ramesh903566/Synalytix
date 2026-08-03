import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Heart, Star, GitMerge, ArrowUpRight, Loader2 } from 'lucide-react';
import { useGithubRepositories, useGithubActivity } from '../hooks/useGithubData';

export const OpenSourceAnalytics: React.FC<{ username: string }> = ({ username }) => {
  const { data: repos, isLoading: reposLoading } = useGithubRepositories(username);
  const { data: activity, isLoading: activityLoading } = useGithubActivity(username);

  const totalStars = repos?.reduce((acc, repo) => acc + repo.stargazerCount, 0) || 0;
  // Approximation of OSS projects maintained: public repos that aren't forks
  const ossProjects = repos?.filter(r => !r.isPrivate && !r.isFork).length || 0;

  // Since we don't have PR data by repo directly, we leave this empty or mock it.
  // In a real scenario, this would come from the backend.
  const topContributions = [
    { repo: 'Synalytix (Internal)', prs: activity?.prs?.count || 0 },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8 h-full flex flex-col"
    >
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <Globe className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">Open Source Impact</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col gap-1 p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 group hover:border-blue-500/40 transition-colors cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Star className="w-16 h-16 text-blue-400" />
          </div>
          <Star className="w-5 h-5 text-blue-400 mb-3 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
          <span className="text-3xl font-bold text-zinc-50 tracking-tight">{totalStars.toLocaleString()}</span>
          <span className="text-xs text-zinc-400 font-medium">Total Stars Earned</span>
        </div>
        <div className="flex flex-col gap-1 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 group hover:border-emerald-500/40 transition-colors cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Heart className="w-16 h-16 text-emerald-400" />
          </div>
          <Heart className="w-5 h-5 text-emerald-400 mb-3 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-3xl font-bold text-zinc-50 tracking-tight">{ossProjects}</span>
          <span className="text-xs text-zinc-400 font-medium">OSS Projects Maintained</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-4">Top External Contributions</h3>
        <div className="space-y-3">
          {topContributions.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              key={item.repo} 
              className="flex items-center justify-between p-4 rounded-xl bg-bg-elevated hover:bg-zinc-800/60 transition-colors cursor-pointer group border border-border-light hover:border-zinc-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                  <GitMerge className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <span className="text-sm font-semibold text-zinc-300 group-hover:text-zinc-50 transition-colors">{item.repo}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-400 transition-colors">{item.prs} PRs</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
