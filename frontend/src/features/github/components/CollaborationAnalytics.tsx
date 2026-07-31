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
      className="bg-zinc-950 border border-zinc-800/50 rounded-3xl p-6 lg:p-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-zinc-400" />
        <h2 className="text-lg font-semibold text-zinc-100">Collaboration</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <GitPullRequest className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">PRs Opened</p>
                <p className="text-xs text-zinc-500">Last 30 days</p>
              </div>
            </div>
            <span className="text-xl font-bold text-zinc-100">42</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">PRs Reviewed</p>
                <p className="text-xs text-zinc-500">Last 30 days</p>
              </div>
            </div>
            <span className="text-xl font-bold text-zinc-100">128</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">Comments</p>
                <p className="text-xs text-zinc-500">Last 30 days</p>
              </div>
            </div>
            <span className="text-xl font-bold text-zinc-100">345</span>
          </div>
        </div>

        <div className="w-full md:w-48 flex flex-col items-center justify-center">
          <h3 className="text-xs font-medium text-zinc-400 mb-2">PR Merge Rate</h3>
          <div className="h-32 w-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PR_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {PR_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A', borderRadius: '8px' }}
                  itemStyle={{ color: '#E4E4E7', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-lg font-bold text-zinc-100">85%</span>
            </div>
          </div>
          <div className="flex gap-3 mt-2 text-[10px] text-zinc-500">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"/>Merged</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/>Closed</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
