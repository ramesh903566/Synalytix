import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, TrendingUp, Lightbulb, CheckCircle2 } from 'lucide-react';

export const AIInsightsPanel: React.FC<{ username: string }> = ({ username }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-950 border border-violet-500/20 rounded-3xl p-6 lg:p-8 relative overflow-hidden group h-full flex flex-col"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-violet-500/20 transition-colors duration-1000" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-500/10 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">AI Analyst Insights</h2>
          <p className="text-xs text-violet-400/70 font-medium">Powered by Synalytix Intelligence</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10 flex-1">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 backdrop-blur-sm border border-border-light hover:border-violet-500/30 rounded-2xl p-5 flex gap-4 transition-colors cursor-default"
        >
          <div className="mt-1 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <TrendingUp className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-100 mb-1.5 flex items-center gap-2">
              High TypeScript Adoption
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              Your repositories show a 40% shift towards TypeScript in the last 6 months. Projects using TS have 3x fewer issues reported on average.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 backdrop-blur-sm border border-border-light hover:border-violet-500/30 rounded-2xl p-5 flex gap-4 transition-colors cursor-default"
        >
          <div className="mt-1 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Lightbulb className="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-100 mb-1.5 flex items-center gap-2">
              Contribution Sweet Spot
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              You are most productive on Tuesdays and Wednesdays between 2 PM and 5 PM. Consider scheduling deep work during these high-focus hours.
            </p>
          </div>
        </motion.div>
      </div>

      <button className="mt-8 flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors group w-fit relative z-10">
        Generate deep analysis report 
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
      </button>
    </motion.div>
  );
};
