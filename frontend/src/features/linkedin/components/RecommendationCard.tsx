import React from 'react';
import { ArrowRight, Zap, Target } from 'lucide-react';
import { AIInsight } from '../types/linkedin';

interface RecommendationCardProps {
  recommendation: AIInsight;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  return (
    <div className="bg-[#11161D] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 flex flex-col justify-between hover:border-[#0A66C2]/30 transition-all">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#0A66C2]" />
            </div>
            <span className="text-xs font-bold text-[#0A66C2] uppercase tracking-widest bg-[#0A66C2]/10 px-2 py-1 rounded">Recommendation</span>
          </div>
          {recommendation.priority && (
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
              recommendation.priority === 'High' ? 'bg-red-500/10 text-red-400' :
              recommendation.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
              'bg-blue-500/10 text-blue-400'
            }`}>
              {recommendation.priority} Priority
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2">{recommendation.title}</h3>
        <p className="text-sm text-zinc-400 mb-6">{recommendation.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#1A222C] rounded-xl p-3">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">Impact</span>
            <span className="text-sm font-bold text-white">{recommendation.impact || 'Unknown'}</span>
          </div>
          <div className="bg-[#1A222C] rounded-xl p-3">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">Difficulty</span>
            <span className="text-sm font-bold text-white">{recommendation.difficulty || 'Unknown'}</span>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0B0F14]/60 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-zinc-500 font-bold uppercase">Confidence</span>
            <span className="text-xs font-bold text-white">{recommendation.confidence}%</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">{recommendation.suggestedAction}</p>
          <p className="text-[11px] text-zinc-500 mt-2">{recommendation.supportingMetrics.join(' | ')}</p>
        </div>
      </div>
      
      <button className="w-full py-3 bg-[#0A66C2] hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
        Take Action <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
