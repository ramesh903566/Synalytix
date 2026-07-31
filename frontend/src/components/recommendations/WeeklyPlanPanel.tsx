import { useState } from 'react';
import { Check } from 'lucide-react';

interface WeeklyPlanPanelProps {
  weeklyPlan: string[];
}

export default function WeeklyPlanPanel({ weeklyPlan }: WeeklyPlanPanelProps) {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  function toggleItem(index: number) {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  const completedCount = completed.size;

  return (
    <div className="bg-white rounded-2xl border border-[#EFEFEF] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#999]">This Week's Plan</h3>
        <span className="text-[10px] font-bold text-brand-primary">
          {completedCount}/5
        </span>
      </div>
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-brand-primary rounded-full transition-all duration-300"
          style={{ width: `${(completedCount / 5) * 100}%` }}
        />
      </div>
      <ol className="space-y-2.5">
        {weeklyPlan.map((action, i) => {
          const isDone = completed.has(i);
          return (
            <li key={i} className="flex items-start gap-3 group">
              <button
                onClick={() => toggleItem(i)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  isDone
                    ? 'bg-brand-primary border-brand-primary'
                    : 'border-neutral-300 hover:border-brand-primary'
                }`}
              >
                {isDone && <Check className="w-3 h-3 text-text-primary" />}
              </button>
              <div className="flex-1">
                <span className={`text-xs leading-relaxed transition-all ${isDone ? 'line-through text-[#999]' : 'text-[#1A1A1A]'}`}>
                  {action}
                </span>
              </div>
              <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest group-hover:text-[#999] transition-colors">
                Day {i + 1}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
