import { useState } from 'react';
import { Zap, Clock, ChevronDown, ChevronUp, HelpCircle, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Recommendation } from '../../types/recommendations';
import { CATEGORY_LABELS } from '../../lib/constants';

interface RecommendationCardProps {
  rec: Recommendation;
  onComplete: (id: string) => void;
  onDismiss: (id: string) => void;
  onExplain: (rec: Recommendation) => void;
}

const PRIORITY_STYLES: Record<string, string> = {
  CRITICAL: 'bg-rose-50 text-rose-700 border-rose-200',
  HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
  MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200',
  LOW: 'bg-neutral-100 text-neutral-600 border-neutral-200',
};

const DIFFICULTY_STYLES: Record<string, string> = {
  EASY: 'bg-emerald-50 text-emerald-700',
  MEDIUM: 'bg-amber-50 text-amber-700',
  HARD: 'bg-rose-50 text-rose-600',
};

export default function RecommendationCard({ rec, onComplete, onDismiss, onExplain }: RecommendationCardProps) {
  const [showSteps, setShowSteps] = useState(false);
  const isComplete = !!rec.completedAt;
  const isDismissed = !!rec.dismissedAt;

  if (isDismissed) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isComplete ? 0.6 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`rounded-2xl border bg-white p-5 transition-all hover:border-neutral-300 ${
        isComplete ? 'border-emerald-200 bg-emerald-50/30' : 'border-[#EFEFEF]'
      }`}
    >
      {/* Header row: badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[rec.priority]}`}>
          {rec.priority}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 border border-neutral-200">
          {CATEGORY_LABELS[rec.category]}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-amber-500" />
          <span className="text-[10px] font-bold text-[#1A1A1A]">{rec.impactScore} impact</span>
        </div>
      </div>

      {/* Title + Description */}
      <h3 className={`text-sm font-semibold text-[#1A1A1A] mb-1 ${isComplete ? 'line-through' : ''}`}>
        {rec.title}
      </h3>
      <p className="text-xs text-[#666] leading-relaxed line-clamp-2 mb-3">
        {rec.description}
      </p>

      {/* Footer row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${DIFFICULTY_STYLES[rec.difficulty]}`}>
          {rec.difficulty}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-[#999]">
          <Clock className="w-3 h-3" />
          <span>{rec.estimatedTime.value} {rec.estimatedTime.unit}</span>
        </span>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => onExplain(rec)}
            className="flex items-center gap-1 text-[10px] font-bold text-brand-primary hover:text-brand-primary/80 transition-colors uppercase tracking-wider"
          >
            <HelpCircle className="w-3 h-3" />
            Why?
          </button>
          {!isComplete && (
            <>
              <button
                onClick={() => onDismiss(rec.id)}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors"
                title="Dismiss"
              >
                <X className="w-3 h-3 text-neutral-400" />
              </button>
              <button
                onClick={() => onComplete(rec.id)}
                className="w-6 h-6 rounded-full border-2 border-neutral-300 flex items-center justify-center hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                title="Mark complete"
              >
                <Check className="w-3 h-3 text-neutral-400" />
              </button>
            </>
          )}
          {isComplete && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <Check className="w-3.5 h-3.5" />
              Done
            </span>
          )}
        </div>
      </div>

      {/* Expandable action steps */}
      <button
        onClick={() => setShowSteps(!showSteps)}
        className="flex items-center gap-1 mt-3 text-[10px] font-bold text-[#999] hover:text-[#1A1A1A] transition-colors uppercase tracking-widest"
      >
        {showSteps ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {showSteps ? 'Hide steps' : `${rec.actionSteps.length} action steps`}
      </button>
      <AnimatePresence>
        {showSteps && (
          <motion.ol
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 space-y-1.5 overflow-hidden"
          >
            {rec.actionSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[#666]">
                <span className="w-4 h-4 rounded-full bg-neutral-100 flex items-center justify-center text-[9px] font-bold text-[#999] flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </motion.ol>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
