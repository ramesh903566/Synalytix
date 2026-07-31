import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { useGithubActivity } from '../hooks/useGithubData';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const COLORS = {
  commits: '#3B82F6', // blue
  prs: '#10B981',     // emerald
  issues: '#F59E0B',  // amber
  reviews: '#8B5CF6', // violet
  discussions: '#EC4899', // pink
  releases: '#06B6D4', // cyan
  forks: '#F97316'    // orange
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 0 8px ${fill}80)` }}
        className="transition-all duration-300"
      />
    </g>
  );
};

export const ActivityOverview: React.FC<{ username: string }> = ({ username }) => {
  const { data: activity, isLoading, isError } = useGithubActivity(username);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  if (isLoading) {
    return <div className="w-full h-80 animate-pulse bg-bg-canvas rounded-3xl border border-border-light" />;
  }

  if (isError || !activity) return null;

  const chartData = Object.entries(activity).map(([key, stat]) => ({
    name: key === 'prs' ? 'Pull Requests' : key.charAt(0).toUpperCase() + key.slice(1),
    key,
    value: stat.count,
    percentage: stat.percentage,
    delta: stat.delta,
    color: COLORS[key as keyof typeof COLORS]
  })).sort((a, b) => b.value - a.value);

  const totalActivity = chartData.reduce((acc, curr) => acc + curr.value, 0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8 flex flex-col h-full relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">Activity Overview</h2>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 relative z-10">
        <div className="w-full lg:w-1/2 h-[220px] lg:h-[280px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="90%"
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                // @ts-expect-error Recharts type definitions are sometimes incomplete for activeIndex
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-zinc-900/90 backdrop-blur-md border border-border-light p-3 rounded-xl shadow-xl shadow-black/50">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                          <span className="text-sm font-medium text-zinc-50">{data.name}</span>
                        </div>
                        <div className="text-2xl font-bold text-zinc-50">{data.value.toLocaleString()}</div>
                        <div className="text-xs text-text-muted">{data.percentage}% of total</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeIndex !== undefined ? 'active' : 'total'}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center"
              >
                <span className="text-3xl font-bold text-zinc-50 tracking-tight">
                  {activeIndex !== undefined ? chartData[activeIndex].value.toLocaleString() : totalActivity.toLocaleString()}
                </span>
                <span className="text-xs text-text-muted uppercase tracking-widest font-medium mt-1">
                  {activeIndex !== undefined ? chartData[activeIndex].name : 'Total Activity'}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-2">
          {chartData.map((stat, index) => (
            <div 
              key={stat.key} 
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={onPieLeave}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-default
                ${activeIndex === index ? 'bg-bg-sunken border-zinc-700/50 scale-[1.02]' : 'bg-transparent border-transparent hover:bg-bg-elevated'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: stat.color, boxShadow: `0 0 8px ${stat.color}80` }} />
                <span className="text-sm font-medium text-zinc-100">{stat.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-zinc-50 w-12 text-right">{stat.value.toLocaleString()}</span>
                <div className={`flex items-center justify-end w-16 text-xs font-medium
                  ${stat.delta.startsWith('+') ? 'text-emerald-400' : stat.delta.startsWith('-') ? 'text-rose-400' : 'text-text-muted'}`}>
                  {stat.delta.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-1" /> : stat.delta.startsWith('-') ? <TrendingDown className="w-3 h-3 mr-1" /> : <Minus className="w-3 h-3 mr-1" />}
                  {stat.delta.replace(/[+-]/, '')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
