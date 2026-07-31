import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, GitFork, Star, CircleDot, ExternalLink } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useGithubRepositories } from '../hooks/useGithubData';

export const RepositoryExplorer: React.FC<{ username: string }> = ({ username }) => {
  const { data: repos, isLoading } = useGithubRepositories(username);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'sources' | 'forks'>('all');

  if (isLoading) {
    return <div className="w-full h-96 animate-pulse bg-bg-canvas rounded-3xl border border-border-light" />;
  }

  const filteredRepos = repos?.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'forks' ? repo.isFork : !repo.isFork);
    return matchesSearch && matchesFilter;
  }) || [];

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredRepos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 88, // increased height slightly for better breathing room
    overscan: 5,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8 flex flex-col h-[600px] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">Repository Explorer</h2>
          <p className="text-sm text-text-muted mt-1">{filteredRepos.length} {filteredRepos.length === 1 ? 'repository' : 'repositories'} found</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 absolute left-3 top-1/2 -translate-y-1/2 transition-colors" aria-hidden="true" />
            <input
              type="text"
              aria-label="Search repositories"
              placeholder="Find a repository..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-900/50 border border-border-light hover:border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all w-full md:w-64 placeholder:text-zinc-600"
            />
          </div>
          <div className="flex bg-zinc-900/50 border border-border-light rounded-lg p-1">
            {(['all', 'sources', 'forks'] as const).map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${filter === f ? 'bg-zinc-700 text-zinc-50 shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div 
        ref={parentRef} 
        className="flex-1 overflow-y-auto pr-2 relative z-10 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent hover:scrollbar-thumb-zinc-600"
      >
        <div 
          className="w-full relative" 
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const repo = filteredRepos[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                className="absolute top-0 left-0 w-full px-1"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-bg-elevated border border-border-light hover:border-zinc-700 hover:bg-zinc-800/40 transition-all gap-4 mb-2 group cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-sm font-semibold text-zinc-100 truncate group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                        {repo.name}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 font-medium">
                        {repo.isFork ? 'Fork' : 'Public'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate pr-4">{repo.description || "No description provided."}</p>
                  </div>
                  
                  <div className="flex items-center gap-5 flex-shrink-0 text-xs text-zinc-400">
                    {repo.primaryLanguage && (
                      <div className="flex items-center gap-1.5 w-24">
                        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: repo.primaryLanguage.color, boxShadow: `0 0 6px ${repo.primaryLanguage.color}80` }} />
                        <span className="truncate font-medium text-zinc-300">{repo.primaryLanguage.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 w-12 group-hover:text-yellow-500/90 transition-colors">
                      <Star className="w-3.5 h-3.5" /> <span className="font-medium text-zinc-300 group-hover:text-zinc-50 transition-colors">{repo.stargazerCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 w-12">
                      <GitFork className="w-3.5 h-3.5" /> <span className="font-medium text-zinc-300">{repo.forkCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 w-12">
                      <CircleDot className="w-3.5 h-3.5" /> <span className="font-medium text-zinc-300">{repo.issues.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredRepos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-zinc-100 font-medium mb-1">No repositories found</h3>
              <p className="text-zinc-500 text-sm">
                We couldn't find anything matching "{search}" with current filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
