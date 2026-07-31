import React from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, MessageSquare, Users, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const PR_DATA = [
  { name: 'Merged', value: 85, color: '#10B981' },
  { name: 'Closed', value: 10, color: '#EF4444' },
  { name: 'Open', value: 5, color: '#3B82F6' },
];

export const CollaborationAnalytics: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8 h-full flex flex-col"
    >
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <Users className="w-5 h-5 text-emerald-400" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">Collaboration</h2>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 flex-1">
        <div className="flex-1 flex flex-col gap-4 justify-center">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-border-light hover:border-zinc-700 transition-colors group cursor-default"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                <GitPullRequest className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-100">PRs Opened</p>
                <p className="text-xs text-zinc-500">Last 30 days</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-zinc-50 group-hover:text-purple-400 transition-colors">42</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-border-light hover:border-zinc-700 transition-colors group cursor-default"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-100">PRs Reviewed</p>
                <p className="text-xs text-zinc-500">Last 30 days</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-zinc-50 group-hover:text-emerald-400 transition-colors">128</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-border-light hover:border-zinc-700 transition-colors group cursor-default"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-100">Comments</p>
                <p className="text-xs text-zinc-500">Last 30 days</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-zinc-50 group-hover:text-amber-400 transition-colors">345</span>
          </motion.div>
        </div>

        <div className="w-full xl:w-56 flex flex-col items-center justify-center bg-zinc-900/30 rounded-2xl border border-border-light p-6">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-4">PR Merge Rate</h3>
          <div className="h-32 w-32 relative mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PR_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius="75%"
                  outerRadius="100%"
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {PR_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 6px ${entry.color}60)` }} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#E4E4E7', fontSize: '13px', fontWeight: 500 }}
                  formatter={(value: any) => [`${value}%`]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-zinc-50 tracking-tight">85%</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-zinc-400">
            {PR_DATA.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}80` }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
