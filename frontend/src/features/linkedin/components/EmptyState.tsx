import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-bg-elevated border border-border-light rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-bg-sunken flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-text-muted" />
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm mb-8">{description}</p>
      
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="px-6 py-2.5 bg-[#0A66C2] hover:bg-blue-700 text-text-primary text-sm font-bold rounded-xl transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
