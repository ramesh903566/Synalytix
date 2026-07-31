import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGithubContributions } from '../hooks/useGithubData';

const LEVEL_COLORS = {
  0: 'bg-bg-elevated', // empty
  1: 'bg-emerald-950/40',
  2: 'bg-emerald-800/60',
  3: 'bg-emerald-600',
  4: 'bg-emerald-400',
};

export const ContributionHeatmap: React.FC<{ username: string }> = ({ username }) => {
  const { data: contribs, isLoading, isError } = useGithubContributions(username);

  const weeks = useMemo(() => {
    if (!contribs?.calendar) return [];
    const chunked = [];
    for (let i = 0; i < contribs.calendar.length; i += 7) {
      chunked.push(contribs.calendar.slice(i, i + 7));
    }
    return chunked;
  }, [contribs]);

  if (isLoading) {
    return <div className="w-full h-64 animate-pulse bg-bg-canvas rounded-3xl border border-border-light" />;
  }

  if (isError || !contribs) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8 flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Contribution Graph</h2>
          <p className="text-sm text-text-secondary">{contribs.totalContributions.toLocaleString()} contributions in the last year</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-text-muted font-medium">Current Streak</p>
            <p className="text-lg font-bold text-text-primary">{contribs.streak.current} days</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-text-muted font-medium">Longest Streak</p>
            <p className="text-lg font-bold text-text-primary">{contribs.streak.longest} days</p>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="flex overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1">
              {week.map((day, dIndex) => (
                <div
                  key={dIndex}
                  className={`w-[11px] h-[11px] rounded-[2px] transition-colors hover:ring-1 hover:ring-zinc-400 ${LEVEL_COLORS[day.level as keyof typeof LEVEL_COLORS]}`}
                  title={`${day.count} contributions on ${day.date}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend & Stats */}
      <div className="flex justify-between items-center mt-4 text-xs text-text-secondary">
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(l => (
              <div key={l} className={`w-[11px] h-[11px] rounded-[2px] ${LEVEL_COLORS[l as keyof typeof LEVEL_COLORS]}`} />
            ))}
          </div>
          <span>More</span>
        </div>
        <div className="flex gap-4">
          <span>Active Day: <strong className="text-text-primary">{contribs.activeDay}</strong></span>
          <span>Avg/Day: <strong className="text-text-primary">{contribs.averagePerDay}</strong></span>
        </div>
      </div>
    </motion.div>
  );
};
