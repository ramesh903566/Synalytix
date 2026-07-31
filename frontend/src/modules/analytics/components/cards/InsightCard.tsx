import React from 'react';
import { AIInsight } from '../../types';
import { AlertCircle, TrendingUp, Users, PlaySquare, AlertTriangle, ArrowRight } from 'lucide-react';

const CATEGORY_ICONS = {
  growth: <TrendingUp className="w-5 h-5 text-green-500" />,
  engagement: <Users className="w-5 h-5 text-blue-500" />,
  content: <PlaySquare className="w-5 h-5 text-purple-500" />,
  audience: <Users className="w-5 h-5 text-orange-500" />,
  risk: <AlertTriangle className="w-5 h-5 text-red-500" />
};

export const InsightCard: React.FC<{ insight: AIInsight }> = ({ insight }) => {
  return (
    <div className="bg-bg-elevated border border-border rounded-2xl p-6 shadow-sm flex flex-col h-full hover:border-border-strong transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bg-sunken flex items-center justify-center border border-border-light">
            {CATEGORY_ICONS[insight.category] || <AlertCircle className="w-5 h-5 text-zinc-500" />}
          </div>
          <div>
            <h3 className="font-bold text-text-primary">{insight.title}</h3>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{insight.category}</span>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
          ${insight.priority === 'critical' ? 'bg-red-100 text-red-700' : 
            insight.priority === 'high' ? 'bg-orange-100 text-orange-700' :
            insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-zinc-100 text-zinc-700'}`}
        >
          {insight.priority} Priority
        </div>
      </div>

      <p className="text-sm text-text-primary mb-6 leading-relaxed font-medium">
        {insight.description}
      </p>

      <div className="space-y-4 mb-6 flex-1">
        <div>
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">The Why</span>
          <p className="text-xs text-text-muted leading-relaxed">{insight.reason}</p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">Evidence</span>
          <p className="text-xs text-text-muted leading-relaxed border-l-2 border-border pl-3 italic">{insight.evidence}</p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">Impact</span>
          <p className="text-xs text-text-muted leading-relaxed">{insight.impact}</p>
        </div>
      </div>

      <div className="mt-auto pt-5 border-t border-border">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2 block flex justify-between">
          Recommended Action
          <span className="text-brand">Confidence: {insight.confidence}%</span>
        </span>
        <div className="bg-brand-light/50 border border-brand/20 p-4 rounded-xl flex gap-3 items-start">
          <ArrowRight className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
          <p className="text-sm font-semibold text-text-primary">{insight.recommendedAction}</p>
        </div>
      </div>
    </div>
  );
};
