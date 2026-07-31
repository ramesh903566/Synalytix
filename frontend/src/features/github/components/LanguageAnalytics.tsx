import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Treemap } from 'recharts';
import { useGithubLanguages } from '../hooks/useGithubData';
import { Code2, LayoutGrid, BarChart2 } from 'lucide-react';

export const LanguageAnalytics: React.FC<{ username: string }> = ({ username }) => {
  const { data: languages, isLoading, isError } = useGithubLanguages(username);
  const [view, setView] = useState<'pie' | 'bar' | 'treemap'>('pie');

  if (isLoading) {
    return <div className="w-full h-[400px] animate-pulse bg-bg-canvas rounded-3xl border border-border-light" />;
  }

  if (isError || !languages || languages.length === 0) return null;

  const totalBytes = languages.reduce((acc, lang) => acc + lang.bytes, 0);
  
  // Format for Treemap
  const treemapData = [{
    name: 'Languages',
    children: languages.map(l => ({ name: l.name, size: l.bytes, color: l.color }))
  }];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.bytes || data.size) / totalBytes * 100).toFixed(1);
      return (
        <div className="bg-zinc-900/90 backdrop-blur-md border border-border-light p-3 rounded-xl shadow-xl flex flex-col gap-1 z-50">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color || (payload[0].color) }} />
            <span className="font-semibold text-zinc-50">{data.name}</span>
          </div>
          <div className="text-zinc-300 text-xs">
            {percentage}% <span className="text-zinc-500 mx-1">•</span> {Math.round((data.bytes || data.size) / 1024).toLocaleString()} KB
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomizedContent = (props: any) => {
    const { root, depth, x, y, width, height, index, payload, colors, rank, name, color } = props;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: color,
            stroke: '#09090B',
            strokeWidth: 2,
            strokeOpacity: 1,
          }}
          className="transition-opacity duration-200 hover:opacity-80"
        />
        {width > 50 && height > 30 && depth === 1 && (
          <text x={x + 8} y={y + 18} fill="#fff" fontSize={12} fontWeight={600} className="pointer-events-none drop-shadow-md">
            {name}
          </text>
        )}
      </g>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8 flex flex-col h-full relative"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">Language Distribution</h2>
        
        <div className="flex bg-bg-elevated p-1 rounded-lg border border-border-light">
          <button onClick={() => setView('pie')} className={`p-1.5 rounded-md transition-colors ${view === 'pie' ? 'bg-zinc-700 text-zinc-50 shadow-sm' : 'text-text-muted hover:text-zinc-300'}`}>
            <PieChart className="w-4 h-4" /> {/* Wait, use an icon instead, let's use BarChart2 for bar */}
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z"/></svg>
          </button>
          <button onClick={() => setView('bar')} className={`p-1.5 rounded-md transition-colors ${view === 'bar' ? 'bg-zinc-700 text-zinc-50 shadow-sm' : 'text-text-muted hover:text-zinc-300'}`}>
            <BarChart2 className="w-4 h-4" />
          </button>
          <button onClick={() => setView('treemap')} className={`p-1.5 rounded-md transition-colors ${view === 'treemap' ? 'bg-zinc-700 text-zinc-50 shadow-sm' : 'text-text-muted hover:text-zinc-300'}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[280px]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={view}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full absolute inset-0"
          >
            {view === 'pie' && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={languages}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="85%"
                    paddingAngle={3}
                    dataKey="bytes"
                    stroke="none"
                    cornerRadius={6}
                  >
                    {languages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}

            {view === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={languages.slice(0, 6)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272A" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A1A1AA' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A1A1AA' }} tickFormatter={(val) => `${Math.round(val/1024)}K`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272A', opacity: 0.4 }} />
                  <Bar dataKey="bytes" radius={[4, 4, 0, 0]}>
                    {languages.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {view === 'treemap' && (
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={treemapData}
                  dataKey="size"
                  aspectRatio={4 / 3}
                  stroke="#fff"
                  content={<CustomizedContent />}
                >
                  <Tooltip content={<CustomTooltip />} />
                </Treemap>
              </ResponsiveContainer>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Top language in center for pie view */}
        {view === 'pie' && languages[0] && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <span className="text-3xl font-bold text-zinc-50 tracking-tight">
              {((languages[0].bytes / totalBytes) * 100).toFixed(0)}%
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: languages[0].color }}>
              {languages[0].name}
            </span>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {languages.slice(0, 6).map((lang) => (
          <div key={lang.name} className="flex flex-col p-3 rounded-xl bg-bg-elevated border border-border-light hover:bg-bg-sunken transition-colors group cursor-default">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2.5 h-2.5 rounded-full shadow-sm group-hover:scale-110 transition-transform" style={{ backgroundColor: lang.color, boxShadow: `0 0 8px ${lang.color}80` }} />
              <span className="text-sm font-medium text-zinc-100 truncate">{lang.name}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted">{Math.round(lang.bytes / 1024).toLocaleString()} KB</span>
              <span className="font-semibold text-zinc-300">{((lang.bytes / totalBytes) * 100).toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
