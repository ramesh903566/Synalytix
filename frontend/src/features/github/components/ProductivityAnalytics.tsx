import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const DATA = [
  { day: 'Mon', commits: 120, avgSize: 45 },
  { day: 'Tue', commits: 250, avgSize: 80 },
  { day: 'Wed', commits: 210, avgSize: 65 },
  { day: 'Thu', commits: 180, avgSize: 55 },
  { day: 'Fri', commits: 190, avgSize: 70 },
  { day: 'Sat', commits: 40, avgSize: 20 },
  { day: 'Sun', commits: 20, avgSize: 10 },
];

export const ProductivityAnalytics: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Productivity</h2>
        <select className="bg-bg-elevated border border-border rounded-lg text-sm text-text-secondary px-3 py-1 outline-none">
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-bg-elevated rounded-xl border border-border-light">
          <p className="text-[10px] uppercase text-text-muted mb-1 tracking-wider">Most Productive Day</p>
          <p className="text-xl font-bold text-text-primary">Tuesday</p>
        </div>
        <div className="p-4 bg-bg-elevated rounded-xl border border-border-light">
          <p className="text-[10px] uppercase text-text-muted mb-1 tracking-wider">Consistency Score</p>
          <p className="text-xl font-bold text-text-primary">92/100</p>
        </div>
        <div className="p-4 bg-bg-elevated rounded-xl border border-border-light">
          <p className="text-[10px] uppercase text-text-muted mb-1 tracking-wider">Avg Commit Size</p>
          <p className="text-xl font-bold text-text-primary">54 LOC</p>
        </div>
        <div className="p-4 bg-bg-elevated rounded-xl border border-border-light">
          <p className="text-[10px] uppercase text-text-muted mb-1 tracking-wider">Longest Gap</p>
          <p className="text-xl font-bold text-text-primary">4 days</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="day" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A', borderRadius: '8px' }}
              cursor={{ fill: '#27272a', opacity: 0.4 }}
            />
            <Bar dataKey="commits" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
