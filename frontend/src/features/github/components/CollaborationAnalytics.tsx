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
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-text-secondary" />
        <h2 className="text-lg font-semibold text-text-primary">Collaboration</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between p-4 bg-bg-elevated rounded-xl border border-border-light">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <GitPullRequest className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">PRs Opened</p>
                <p className="text-xs text-text-muted">Last 30 days</p>
              </div>
            </div>
            <span className="text-xl font-bold text-text-primary">42</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-bg-elevated rounded-xl border border-border-light">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">PRs Reviewed</p>
                <p className="text-xs text-text-muted">Last 30 days</p>
              </div>
            </div>
            <span className="text-xl font-bold text-text-primary">128</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-bg-elevated rounded-xl border border-border-light">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Comments</p>
                <p className="text-xs text-text-muted">Last 30 days</p>
              </div>
            </div>
            <span className="text-xl font-bold text-text-primary">345</span>
          </div>
        </div>

        <div className="w-full md:w-48 flex flex-col items-center justify-center">
          <h3 className="text-xs font-medium text-text-secondary mb-2">PR Merge Rate</h3>
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
              <span className="text-lg font-bold text-text-primary">85%</span>
            </div>
          </div>
          <div className="flex gap-3 mt-2 text-[10px] text-text-muted">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"/>Merged</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/>Closed</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
