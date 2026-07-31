import React from 'react';
import { motion } from 'motion/react';
import { FolderX } from 'lucide-react';
import { scaleIn } from '../../animations/variants';
import { cn } from '../../../../lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data available',
  description = 'There is no data to display for the selected period.',
  icon = <FolderX className="w-12 h-12 text-text-muted" />,
  action,
  className,
}) => {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border-light bg-bg-elevated',
        className
      )}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </motion.div>
  );
};
