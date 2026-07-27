import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DataPoint } from '../types/linkedin';

interface AnalyticsChartProps {
  data: DataPoint[];
  dataKey: string;
  color: string;
  gradientId: string;
  title: string;
  subtitle?: string;
  height?: number;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ 
  data, 
  dataKey, 
  color, 
  gradientId, 
  title, 
  subtitle,
  height = 300 
}) => {
  return (
    <div className="bg-[#11161D] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {subtitle && <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>}
      </div>
      
      <div style={{ height: `${height}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 11 }} dy={10} minTickGap={20} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 11 }} dx={-10} tickFormatter={v => v >= 1000 ? `${v/1000}K` : v} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(17, 22, 29, 0.8)', 
                backdropFilter: 'blur(12px)',
                borderColor: 'rgba(255,255,255,0.1)', 
                borderRadius: '12px', 
                color: '#fff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)'
              }} 
              itemStyle={{ color: color }}
            />
            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fill={`url(#${gradientId})`} dot={{ r: 0 }} activeDot={{ r: 6, fill: color, stroke: '#11161D', strokeWidth: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
