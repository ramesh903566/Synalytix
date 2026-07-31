import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { KPI, AIInsight } from '../../types/xAnalytics';
import { scaleIn } from '../../animations/variants';
import { cn } from '../../../../lib/utils';

interface InsightCardProps {
  insight: AIInsight;
  className?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, className }) => {
  const isPositive = insight.type === 'positive' || insight.type === 'opportunity';
  const isWarning = insight.type === 'negative' || insight.type === 'warning';
  
  const Icon = isPositive ? TrendingUp : isWarning ? AlertTriangle : Lightbulb;
  const colorClass = isPositive ? 'text-green-500 bg-green-500/10' : isWarning ? 'text-yellow-500 bg-yellow-500/10' : 'text-blue-500 bg-blue-500/10';
  const borderColor = isPositive ? 'hover:border-green-500/50' : isWarning ? 'hover:border-yellow-500/50' : 'hover:border-blue-500/50';

  return (
    <motion.div
      variants={scaleIn}
      className={cn(
        'relative group overflow-hidden bg-bg-elevated border border-border rounded-xl p-5 backdrop-blur-md shadow-xl transition-all duration-300',
        borderColor,
        className
      )}
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles className={cn("w-16 h-16", isPositive ? 'text-green-500' : isWarning ? 'text-yellow-500' : 'text-blue-500')} />
      </div>
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={cn("p-1.5 rounded-lg", colorClass)}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{insight.type}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 tracking-wider">
                🤖 AI Generated
              </span>
            </div>
            {insight.priority === 'high' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 uppercase tracking-wider">
                Priority
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">{insight.title}</h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">{insight.description}</p>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-light">
          <span className="text-xs font-medium text-text-muted flex items-center gap-1">
            {insight.confidence}% Confidence
          </span>
          {insight.actionText && (
            <button className="flex items-center gap-1 text-xs font-semibold text-text-primary hover:text-blue-400 transition-colors group/btn">
              {insight.actionText}
              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
