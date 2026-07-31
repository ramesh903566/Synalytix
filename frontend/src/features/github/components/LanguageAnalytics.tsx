import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useGithubLanguages } from '../hooks/useGithubData';

export const LanguageAnalytics: React.FC<{ username: string }> = ({ username }) => {
  const { data: languages, isLoading, isError } = useGithubLanguages(username);

  if (isLoading) {
    return <div className="w-full h-80 animate-pulse bg-bg-canvas rounded-3xl border border-border-light" />;
  }

  if (isError || !languages) return null;

  const totalBytes = languages.reduce((acc, lang) => acc + lang.bytes, 0);

  // Custom tooltip for Pie Chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.bytes / totalBytes) * 100).toFixed(1);
      return (
        <div className="bg-bg-elevated border border-border p-3 rounded-xl shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="font-medium text-text-primary">{data.name}</span>
          </div>
          <div className="text-text-secondary text-xs">
            {percentage}% ({Math.round(data.bytes / 1024)} KB)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8 flex flex-col h-full"
    >
      <h2 className="text-lg font-semibold text-text-primary mb-6">Language Distribution</h2>
      
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={languages}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="bytes"
              stroke="none"
              cornerRadius={4}
            >
              {languages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Top language in center */}
        {languages[0] && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-text-primary">
              {((languages[0].bytes / totalBytes) * 100).toFixed(0)}%
            </span>
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: languages[0].color }}>
              {languages[0].name}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {languages.slice(0, 5).map((lang) => (
          <div key={lang.name} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
            <span className="text-text-secondary">{lang.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
