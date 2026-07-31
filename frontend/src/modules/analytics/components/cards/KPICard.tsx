import React from 'react';
import { KPIMetric } from '../../types';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export const KPICard: React.FC<{ metric: KPIMetric }> = ({ metric }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  const trendIcon = metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→';

  const formatValue = (value: string | number, format?: string) => {
    if (typeof value === 'string') return value;
    if (format === 'percentage') return `${value.toFixed(1)}%`;
    if (format === 'compact') {
      return Intl.NumberFormat('en-US', { notation: 'compact' }).format(value);
    }
    return value.toLocaleString();
  };

  return (
    <div className="p-5 bg-bg-elevated border border-border rounded-2xl flex flex-col hover:border-border-strong transition-colors shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-text-muted">{metric.label}</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(metric.status)}`}>
          {metric.status}
        </span>
      </div>
      
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-text-primary">{formatValue(metric.currentValue, metric.format)}</span>
        <span className={`text-sm font-semibold flex items-center gap-0.5 ${getTrendColor(metric.trend)}`}>
          {trendIcon} {Math.abs(metric.trendPercentage)}%
        </span>
      </div>

      <div className="h-12 w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metric.sparklineData}>
            <defs>
              <linearGradient id={`gradient-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metric.trend === 'down' ? '#ef4444' : '#22c55e'} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={metric.trend === 'down' ? '#ef4444' : '#22c55e'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={metric.trend === 'down' ? '#ef4444' : '#22c55e'} 
              strokeWidth={2} 
              fill={`url(#gradient-${metric.id})`} 
              dot={false} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {metric.aiSummary && (
        <div className="mt-4 text-xs text-text-secondary bg-bg-sunken p-3 rounded-xl border border-border-light">
          <span className="font-semibold text-text-primary">✨ AI Note:</span> {metric.aiSummary}
        </div>
      )}
    </div>
  );
};
