import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendBadgeProps {
  value: number;
  isPercentage?: boolean;
}

export const TrendBadge: React.FC<TrendBadgeProps> = ({ value, isPercentage = true }) => {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const getColors = () => {
    if (isPositive) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (isNeutral) return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
    return 'bg-red-500/10 text-red-400 border border-red-500/20';
  };

  const getIcon = () => {
    if (isPositive) return <TrendingUp className="w-3 h-3" />;
    if (isNeutral) return <Minus className="w-3 h-3" />;
    return <TrendingDown className="w-3 h-3" />;
  };

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold ${getColors()}`}>
      {getIcon()}
      <span>
        {isPositive ? '+' : ''}{value}{isPercentage ? '%' : ''}
      </span>
    </div>
  );
};
