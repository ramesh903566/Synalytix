import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, GitFork, Star, CircleDot } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useGithubRepositories } from '../hooks/useGithubData';

export const RepositoryExplorer: React.FC<{ username: string }> = ({ username }) => {
  const { data: repos, isLoading } = useGithubRepositories(username);
  const [search, setSearch] = useState('');

  if (isLoading) {
    return <div className="w-full h-96 animate-pulse bg-zinc-950 rounded-3xl border border-zinc-800/50" />;
  }

  const filteredRepos = repos?.filter(repo => repo.name.toLowerCase().includes(search.toLowerCase())) || [];

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredRepos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // estimated height of each row in px
    overscan: 5,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-950 border border-zinc-800/50 rounded-3xl p-6 lg:p-8 flex flex-col h-[500px]"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-zinc-100">Repository Explorer</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              aria-label="Search repositories"
              placeholder="Find a repository..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors w-full md:w-64"
            />
          </div>
          <button 
            aria-label="Filter repositories"
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div ref={parentRef} className="flex-1 overflow-y-auto pr-2 hide-scrollbar relative">
        <div 
          className="w-full relative" 
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const repo = filteredRepos[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                className="absolute top-0 left-0 w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900/80 transition-colors gap-4 mx-1 my-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-zinc-100 truncate hover:text-blue-400 cursor-pointer">{repo.name}</h3>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">Public</span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{repo.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-6 flex-shrink-0 text-xs text-zinc-400">
                    {repo.primaryLanguage && (
                      <div className="flex items-center gap-1.5 w-24">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: repo.primaryLanguage.color }} />
                        <span className="truncate">{repo.primaryLanguage.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 w-12">
                      <Star className="w-3.5 h-3.5" /> {repo.stargazerCount}
                    </div>
                    <div className="flex items-center gap-1 w-12">
                      <GitFork className="w-3.5 h-3.5" /> {repo.forkCount}
                    </div>
                    <div className="flex items-center gap-1 w-12">
                      <CircleDot className="w-3.5 h-3.5" /> {repo.issues}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredRepos.length === 0 && (
            <div className="text-center py-12 text-zinc-500 text-sm">
              No repositories found matching "{search}"
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
