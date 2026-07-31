import React from 'react';
import { Target, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressTrackerProps {
  completedCount: number;
  totalCount: number;
  growthImpact?: number;
}

export default function ProgressTracker({ completedCount, totalCount, growthImpact = 0 }: ProgressTrackerProps) {
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 text-text-primary space-y-6"
    >
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Target className="w-5 h-5 text-indigo-400" />
        Progress Tracker
      </h3>

      <div className="space-y-4">
        {/* Row 1: Recommendations Completed */}
        <div>
          <div className="flex justify-between text-sm mb-1 text-slate-300">
            <span>Completed this month</span>
            <span className="font-medium text-text-primary">{completedCount} / {totalCount}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Row 2: Success Rate (Mocked for now as per spec) */}
        <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-md">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-slate-200">Success Rate</span>
          </div>
          <span className="text-sm font-bold text-emerald-400">92%</span>
        </div>

        {/* Row 3: Growth Impact */}
        <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-md">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-sm font-medium text-slate-200">Growth Impact</span>
          </div>
          <span className={`text-sm font-bold ${growthImpact >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {growthImpact >= 0 ? '+' : ''}{growthImpact} pts
          </span>
        </div>
      </div>
    </motion.div>
  );
}
