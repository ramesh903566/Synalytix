import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { scaleIn } from '../../animations/variants';

export const AnalyticsErrorBoundary: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <motion.div 
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="w-full h-64 flex flex-col items-center justify-center bg-bg-elevated border border-border-light rounded-xl p-6 text-center backdrop-blur-sm"
    >
      <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-text-primary mb-2">Unable to load analytics</h3>
      <p className="text-sm text-text-secondary mb-6 max-w-md">
        We encountered an unexpected error while rendering this section. Please try refreshing.
        {process.env.NODE_ENV === 'development' && (
          <span className="block mt-2 text-xs font-mono text-red-400 truncate max-w-xs mx-auto">
            {error instanceof Error ? error.message : String(error)}
          </span>
        )}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="flex items-center gap-2 px-4 py-2 bg-bg-sunken hover:bg-bg-sunken hover:bg-border text-text-primary text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-bg-canvas"
      >
        <RefreshCcw className="w-4 h-4" />
        Retry
      </button>
    </motion.div>
  );
};
