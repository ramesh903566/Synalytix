import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, GitFork, Star, CircleDot } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useGithubRepositories } from '../hooks/useGithubData';

export const RepositoryExplorer: React.FC<{ username: string }> = ({ username }) => {
  const { data: repos, isLoading } = useGithubRepositories(username);
  const [search, setSearch] = useState('');

  if (isLoading) {
    return <div className="w-full h-96 animate-pulse bg-bg-canvas rounded-3xl border border-border-light" />;
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
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8 flex flex-col h-[500px]"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Repository Explorer</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              aria-label="Search repositories"
              placeholder="Find a repository..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-bg-elevated border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-blue-500 transition-colors w-full md:w-64"
            />
          </div>
          <button 
            aria-label="Filter repositories"
            className="p-2 bg-bg-elevated border border-border rounded-lg text-text-secondary hover:text-text-primary transition-colors"
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-bg-elevated border border-border-light hover:bg-bg-elevated transition-colors gap-4 mx-1 my-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-text-primary truncate hover:text-blue-400 cursor-pointer">{repo.name}</h3>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-bg-sunken text-text-secondary">Public</span>
                    </div>
                    <p className="text-xs text-text-muted truncate">{repo.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-6 flex-shrink-0 text-xs text-text-secondary">
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
            <div className="text-center py-12 text-text-muted text-sm">
              No repositories found matching "{search}"
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
