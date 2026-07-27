import React from 'react';
import { Sparkles, CheckCircle2, Lightbulb, Activity, AlertTriangle } from 'lucide-react';
import { AIInsight } from '../types/linkedin';

interface InsightCardProps {
  insight: AIInsight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'positive': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'negative': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'insight': return <Lightbulb className="w-5 h-5 text-[#0A66C2]" />;
      case 'action': return <Activity className="w-5 h-5 text-purple-400" />;
      default: return <Sparkles className="w-5 h-5 text-zinc-400" />;
    }
  };

  const getStyles = () => {
    switch (insight.type) {
      case 'positive': return 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10';
      case 'negative': return 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10';
      case 'insight': return 'border-[#0A66C2]/30 bg-[#0A66C2]/5 hover:bg-[#0A66C2]/10';
      case 'action': return 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10';
      default: return 'border-[rgba(255,255,255,0.06)] bg-[#11161D] hover:bg-[#1A222C]';
    }
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all cursor-pointer ${getStyles()}`}>
      <div className="flex items-center gap-3 mb-3">
        {getIcon()}
        <h4 className="font-bold text-white text-sm">{insight.title}</h4>
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed">{insight.description}</p>

      <div className="mt-4 text-[11px] text-zinc-500 leading-relaxed">
        <span className="font-bold text-zinc-400">Confidence {insight.confidence}%:</span> {insight.supportingMetrics.join(' | ')}
      </div>
      
      {insight.estimatedGain && (
        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs">
          <span className="text-zinc-500">Estimated Impact</span>
          <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
            {insight.estimatedGain}
          </span>
        </div>
      )}
    </div>
  );
};
