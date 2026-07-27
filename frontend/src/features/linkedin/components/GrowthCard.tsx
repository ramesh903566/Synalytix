import React from 'react';
import { TrendBadge } from './TrendBadge';

interface GrowthCardProps {
  title: string;
  value: string | number;
  growth: number;
  description: string;
}

export const GrowthCard: React.FC<GrowthCardProps> = ({ title, value, growth, description }) => {
  return (
    <div className="bg-[#11161D] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-zinc-400 mb-2">{title}</h3>
        <div className="flex items-end gap-3 mb-2">
          <span className="text-3xl font-bold text-white">{value}</span>
          <TrendBadge value={growth} />
        </div>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
    </div>
  );
};
