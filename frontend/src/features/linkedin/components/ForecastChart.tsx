import React from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DataPoint } from '../types/linkedin';

interface ForecastChartProps {
  data: DataPoint[];
  title: string;
  subtitle?: string;
  height?: number;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ 
  data, 
  title, 
  subtitle,
  height = 300 
}) => {
  return (
    <div className="bg-bg-elevated border border-border-light rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-text-primary">{title}</h3>
        {subtitle && <p className="text-sm text-text-muted mt-1">{subtitle}</p>}
      </div>
      
      <div style={{ height: `${height}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0A66C2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 11 }} dy={10} minTickGap={20} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 11 }} dx={-10} tickFormatter={v => v >= 1000 ? `${v/1000}K` : v} domain={['dataMin - 100', 'dataMax + 100']} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(17, 22, 29, 0.8)', 
                backdropFilter: 'blur(12px)',
                borderColor: 'rgba(255,255,255,0.1)', 
                borderRadius: '12px', 
                color: '#fff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)'
              }} 
            />
            <Area type="monotone" dataKey="value" stroke="#0A66C2" strokeWidth={3} fill="url(#actualGradient)" />
            <Line type="monotone" dataKey="forecast" stroke="#10B981" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
