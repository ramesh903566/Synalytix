import React from 'react';
import { motion } from 'motion/react';
import { slideUp } from '../../animations/variants';
import { cn } from '../../../../lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  action,
  className,
}) => {
  return (
    <motion.div
      variants={slideUp}
      className={cn(
        'bg-bg-elevated border border-border-light rounded-xl p-6 backdrop-blur-sm shadow-xl flex flex-col',
        className
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 w-full relative">
        {children}
      </div>
    </motion.div>
  );
};
