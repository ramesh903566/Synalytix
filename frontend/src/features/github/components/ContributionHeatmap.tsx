import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGithubContributions } from '../hooks/useGithubData';
import { Flame, Clock, Calendar } from 'lucide-react';

const LEVEL_COLORS = {
  0: 'bg-zinc-900/50', // empty
  1: 'bg-emerald-900/40',
  2: 'bg-emerald-700/60',
  3: 'bg-emerald-500/80',
  4: 'bg-emerald-400',
};

export const ContributionHeatmap: React.FC<{ username: string }> = ({ username }) => {
  const { data: contribs, isLoading, isError } = useGithubContributions(username);
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  const weeks = useMemo(() => {
    if (!contribs?.calendar) return [];
    const chunked = [];
    for (let i = 0; i < contribs.calendar.length; i += 7) {
      chunked.push(contribs.calendar.slice(i, i + 7));
    }
    return chunked;
  }, [contribs]);

  if (isLoading) {
    return <div className="w-full h-80 animate-pulse bg-bg-canvas rounded-3xl border border-border-light" />;
  }

  if (isError || !contribs) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8 flex flex-col relative overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">Contribution Graph</h2>
          </div>
          <p className="text-sm text-text-secondary">{contribs.totalContributions.toLocaleString()} contributions in the last year</p>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-3 bg-bg-elevated px-4 py-2 rounded-xl border border-border-light">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Current Streak</p>
              <p className="text-lg font-bold text-zinc-50">{contribs.streak.current} <span className="text-sm text-text-secondary font-normal">days</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-bg-elevated px-4 py-2 rounded-xl border border-border-light">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Calendar className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Longest Streak</p>
              <p className="text-lg font-bold text-zinc-50">{contribs.streak.longest} <span className="text-sm text-text-secondary font-normal">days</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="flex overflow-x-auto pb-6 hide-scrollbar relative">
        <div className="flex gap-[3px] min-w-max relative" onMouseLeave={() => setHoveredDay(null)}>
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-[3px]">
              {week.map((day, dIndex) => (
                <div
                  key={dIndex}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredDay({ date: day.date, count: day.count, x: rect.left, y: rect.top });
                  }}
                  className={`w-[13px] h-[13px] rounded-[3px] transition-all duration-200 cursor-crosshair hover:ring-1 hover:ring-zinc-400 hover:scale-110 z-10 relative ${LEVEL_COLORS[day.level as keyof typeof LEVEL_COLORS]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Tooltip */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 pointer-events-none bg-zinc-900/90 backdrop-blur-md border border-border-light text-zinc-50 text-xs px-3 py-2 rounded-lg shadow-xl shadow-black/50 flex flex-col items-center"
            style={{
              left: hoveredDay.x + 6.5,
              top: hoveredDay.y - 10,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <span className="font-semibold text-emerald-400 mb-1">{hoveredDay.count} contributions</span>
            <span className="text-text-muted">{new Date(hoveredDay.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-2 text-sm text-text-secondary border-t border-border-light pt-4 gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium">Less</span>
          <div className="flex gap-[3px]">
            {[0, 1, 2, 3, 4].map(l => (
              <div key={l} className={`w-[13px] h-[13px] rounded-[3px] ${LEVEL_COLORS[l as keyof typeof LEVEL_COLORS]}`} />
            ))}
          </div>
          <span className="text-xs font-medium">More</span>
        </div>
        
        <div className="flex gap-6 text-xs bg-bg-elevated px-4 py-2 rounded-full border border-border-light">
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-text-muted" />
            <span>Active Day: <strong className="text-zinc-50">{contribs.activeDay}</strong></span>
          </div>
          <div className="w-px h-4 bg-border-light" />
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-text-muted" />
            <span>Active Month: <strong className="text-zinc-50">{contribs.activeMonth}</strong></span>
          </div>
          <div className="w-px h-4 bg-border-light" />
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-text-muted" />
            <span>Avg/Day: <strong className="text-zinc-50">{contribs.averagePerDay}</strong></span>
          </div>
          {contribs.morningVsEvening && (
            <>
              <div className="w-px h-4 bg-border-light" />
              <div className="flex items-center gap-1.5">
                <span className="text-orange-400">☀ {contribs.morningVsEvening.morning}%</span>
                <span className="text-blue-400">☾ {contribs.morningVsEvening.evening}%</span>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
