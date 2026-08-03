import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';

import { useGithubContributions } from '../hooks/useGithubData';

// Helper to get day name from date string
const getDayName = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900/90 backdrop-blur-md border border-border-light p-4 rounded-xl shadow-xl z-50">
        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3">{label}</p>
        <div className="flex flex-col gap-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-zinc-300">{entry.name === 'commits' ? 'Commits' : entry.name === 'lines' ? 'Lines Changed' : 'Avg LOC'}</span>
              </div>
              <span className="font-bold text-zinc-50">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const ProductivityAnalytics: React.FC<{ username: string }> = ({ username }) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const { data } = useGithubContributions(username);
  
  // Create a default empty data structure
  const emptyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    day, commits: 0, avgSize: 0, lines: 0
  }));

  const chartData = emptyData; // To be populated from data?.events in future

  // For now, if we have data, we just use the emptyData or some aggregate
  const mostProductiveDay = data?.activeDay || 'N/A';
  const consistencyScore = 0; // derived from streaks
  const avgCommitSize = 0;
  const longestGap = 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">Productivity Patterns</h2>
          <p className="text-sm text-zinc-400 mt-1">Analyze when you write the most code</p>
        </div>
        
        <div className="flex bg-zinc-900/50 border border-border-light rounded-lg p-1 w-fit">
          <button 
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${timeframe === 'weekly' ? 'bg-zinc-700 text-zinc-50 shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${timeframe === 'monthly' ? 'bg-zinc-700 text-zinc-50 shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="p-5 bg-zinc-900/50 rounded-2xl border border-border-light hover:border-zinc-700 transition-colors group cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Calendar className="w-12 h-12" />
          </div>
          <p className="text-[10px] uppercase text-zinc-400 mb-2 tracking-wider font-semibold">Most Productive Day</p>
          <p className="text-2xl font-bold text-zinc-50 group-hover:text-blue-400 transition-colors">{mostProductiveDay}</p>
        </div>
        <div className="p-5 bg-zinc-900/50 rounded-2xl border border-border-light hover:border-zinc-700 transition-colors group cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-12 h-12" />
          </div>
          <p className="text-[10px] uppercase text-zinc-400 mb-2 tracking-wider font-semibold">Consistency Score</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-zinc-50 group-hover:text-emerald-400 transition-colors">{consistencyScore}</p>
            <p className="text-sm font-medium text-zinc-500 mb-1">/100</p>
          </div>
        </div>
        <div className="p-5 bg-zinc-900/50 rounded-2xl border border-border-light hover:border-zinc-700 transition-colors group cursor-default">
          <p className="text-[10px] uppercase text-zinc-400 mb-2 tracking-wider font-semibold">Avg Commit Size</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-zinc-50 group-hover:text-purple-400 transition-colors">{avgCommitSize}</p>
            <p className="text-sm font-medium text-zinc-500 mb-1">LOC</p>
          </div>
        </div>
        <div className="p-5 bg-zinc-900/50 rounded-2xl border border-border-light hover:border-zinc-700 transition-colors group cursor-default">
          <p className="text-[10px] uppercase text-zinc-400 mb-2 tracking-wider font-semibold">Longest Gap</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-zinc-50 group-hover:text-rose-400 transition-colors">{longestGap}</p>
            <p className="text-sm font-medium text-zinc-500 mb-1">days</p>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLines" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#27272a" vertical={false} />
            <XAxis dataKey="day" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis yAxisId="left" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a', opacity: 0.3 }} />
            
            <Bar yAxisId="left" dataKey="commits" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Area yAxisId="right" type="monotone" dataKey="lines" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorLines)" />
            <Line yAxisId="left" type="monotone" dataKey="avgSize" stroke="#A855F7" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
