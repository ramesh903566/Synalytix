import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useGithubActivity } from '../hooks/useGithubData';

const COLORS = {
  commits: '#3B82F6',
  prs: '#10B981',
  issues: '#F59E0B',
  reviews: '#8B5CF6',
  discussions: '#EC4899'
};

export const ActivityOverview: React.FC<{ username: string }> = ({ username }) => {
  const { data: activity, isLoading, isError } = useGithubActivity(username);

  if (isLoading) {
    return <div className="w-full h-80 animate-pulse bg-bg-canvas rounded-3xl border border-border-light" />;
  }

  if (isError || !activity) return null;

  const chartData = [
    { name: 'Commits', value: activity.commits.count, color: COLORS.commits },
    { name: 'Pull Requests', value: activity.prs.count, color: COLORS.prs },
    { name: 'Issues', value: activity.issues.count, color: COLORS.issues },
    { name: 'Reviews', value: activity.reviews.count, color: COLORS.reviews },
    { name: 'Discussions', value: activity.discussions.count, color: COLORS.discussions }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8 flex flex-col h-full"
    >
      <h2 className="text-lg font-semibold text-text-primary mb-6">Activity Overview</h2>
      
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8">
        <div className="w-full lg:w-1/2 h-[200px] lg:h-[250px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A', borderRadius: '8px' }}
                itemStyle={{ color: '#FAFAFA' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-text-primary">
              {Object.values(activity).reduce((acc, curr) => acc + curr.count, 0)}
            </span>
            <span className="text-xs text-text-muted uppercase tracking-wider">Total</span>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-3">
          {Object.entries(activity).map(([key, stat]) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated border border-border-light hover:bg-bg-elevated transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[key as keyof typeof COLORS] }} />
                <span className="text-sm font-medium text-text-primary capitalize">
                  {key === 'prs' ? 'Pull Requests' : key}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-text-primary">{stat.count}</span>
                <span className={`text-xs ${stat.delta.startsWith('+') ? 'text-emerald-400' : 'text-text-muted'}`}>
                  {stat.delta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
