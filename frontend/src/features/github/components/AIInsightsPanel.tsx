import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, TrendingUp, Lightbulb } from 'lucide-react';

export const AIInsightsPanel: React.FC<{ username: string }> = ({ username }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-violet-950/20 border border-violet-500/20 rounded-3xl p-6 lg:p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary">AI Analyst Insights</h2>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="bg-bg-canvas/50 backdrop-blur-sm border border-border-light rounded-2xl p-5 flex gap-4">
          <div className="mt-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-1">High TypeScript Adoption</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Your repositories show a 40% shift towards TypeScript in the last 6 months. Projects using TS have 3x fewer issues reported on average.
            </p>
          </div>
        </div>

        <div className="bg-bg-canvas/50 backdrop-blur-sm border border-border-light rounded-2xl p-5 flex gap-4">
          <div className="mt-1">
            <Lightbulb className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-1">Contribution Sweet Spot</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              You are most productive on Tuesdays and Wednesdays between 2 PM and 5 PM. Consider scheduling deep work during these high-focus hours.
            </p>
          </div>
        </div>
      </div>

      <button className="mt-6 flex items-center gap-2 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors group">
        Generate deep analysis report 
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};
