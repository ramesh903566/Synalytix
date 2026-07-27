import React from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { KPI } from '../../types/xAnalytics';
import { TrendBadge } from '../shared/TrendBadge';
import { scaleIn } from '../../animations/variants';
import { cn } from '../../utils/cn';

interface MetricCardProps {
  kpi: KPI;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const MetricCard: React.FC<MetricCardProps> = React.memo(({ kpi, icon, isActive, onClick, className }) => {
  const isPositive = kpi.trend === 'up';
  const color = isPositive ? '#22c55e' : kpi.trend === 'down' ? '#ef4444' : '#71717a';

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      role="button"
      tabIndex={onClick ? 0 : undefined}
      aria-pressed={isActive}
      aria-label={`Metric ${kpi.label}, value ${formatNumber(kpi.value)}, trend ${kpi.trend}`}
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-zinc-900/40 p-5 backdrop-blur-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900',
        isActive ? 'border-blue-500 bg-blue-500/5' : 'border-zinc-800/50 hover:bg-zinc-800/40 hover:border-zinc-700',
        onClick ? 'cursor-pointer' : '',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && <div className="text-zinc-400 group-hover:text-zinc-300 transition-colors">{icon}</div>}
          <h4 className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">{kpi.label}</h4>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-white tracking-tight">{formatNumber(kpi.value)}</span>
        <TrendBadge trend={kpi.trend} value={kpi.change} />
      </div>

      {kpi.history && (
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 group-hover:opacity-60 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={kpi.history}>
              <defs>
                <linearGradient id={`gradient-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2} 
                fill={`url(#gradient-${kpi.id})`} 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
});

MetricCard.displayName = 'MetricCard';
