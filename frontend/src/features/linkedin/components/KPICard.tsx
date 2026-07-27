import React from 'react';
import { TrendBadge } from './TrendBadge';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: string | number;
  trend: number;
  icon: React.ElementType;
  sparklineData?: { val: number }[];
  previousPeriod?: string;
  insight?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, trend, icon: Icon, sparklineData, previousPeriod, insight }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#11161D] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 hover:border-[rgba(255,255,255,0.15)] transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#1A222C] flex items-center justify-center group-hover:bg-[#0A66C2] transition-colors">
            <Icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
          </div>
          <TrendBadge value={trend} />
        </div>
        
        <div>
          <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
          <p className="text-sm text-zinc-500 font-medium">{title}</p>
        </div>
      </div>

      {sparklineData && (
        <div className="h-12 w-full mt-4 opacity-50 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`color-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={trend >= 0 ? '#10B981' : '#EF4444'} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={trend >= 0 ? '#10B981' : '#EF4444'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={['dataMin', 'dataMax']} hide />
              <Area 
                type="monotone" 
                dataKey="val" 
                stroke={trend >= 0 ? '#10B981' : '#EF4444'} 
                fill={`url(#color-${title})`} 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {(previousPeriod || insight) && (
        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs text-zinc-500">
          {previousPeriod && <span>vs {previousPeriod}</span>}
          {insight && <span className="text-[#0A66C2] truncate ml-2">{insight}</span>}
        </div>
      )}
    </motion.div>
  );
};
