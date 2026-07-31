import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

const trendBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      trend: {
        up: 'bg-green-500/10 text-green-500',
        down: 'bg-red-500/10 text-red-500',
        neutral: 'bg-bg-canvas text-text-secondary',
      },
    },
    defaultVariants: {
      trend: 'neutral',
    },
  }
);

export interface TrendBadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof trendBadgeVariants> {
  value: number;
}

export const TrendBadge: React.FC<TrendBadgeProps> = ({ className, trend, value, ...props }) => {
  const Icon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;

  return (
    <div className={cn(trendBadgeVariants({ trend }), className)} {...props}>
      <Icon className="w-3.5 h-3.5" />
      <span>{Math.abs(value)}%</span>
    </div>
  );
};
