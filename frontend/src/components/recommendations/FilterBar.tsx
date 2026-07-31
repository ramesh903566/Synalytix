import { X as XIcon } from 'lucide-react';
import { CATEGORY_LABELS } from '../../lib/constants';
import {
  RecommendationCategory,
  Priority,
  Difficulty,
} from '../../types/recommendations';
import { RecommendationsFilters } from '../../store/recommendationsStore';

interface FilterBarProps {
  filters: RecommendationsFilters;
  onFilterChange: (filters: RecommendationsFilters) => void;
}

const CATEGORIES: RecommendationCategory[] = [
  'CAREER_GROWTH', 'PERSONAL_BRANDING', 'TECHNICAL_SKILLS',
  'NETWORKING', 'OPEN_SOURCE', 'ENTREPRENEURSHIP',
];
const PRIORITIES: Priority[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const hasActiveFilters = filters.category || filters.priority || filters.difficulty || filters.showCompleted;

  function toggleCategory(cat: RecommendationCategory) {
    onFilterChange({ ...filters, category: filters.category === cat ? null : cat });
  }

  function togglePriority(pri: Priority) {
    onFilterChange({ ...filters, priority: filters.priority === pri ? null : pri });
  }

  function toggleDifficulty(diff: Difficulty) {
    onFilterChange({ ...filters, difficulty: filters.difficulty === diff ? null : diff });
  }

  function clearAll() {
    onFilterChange({ category: null, priority: null, difficulty: null, showCompleted: false });
  }

  return (
    <div className="space-y-3">
      {/* Category filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#999] mr-1">Category</span>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all ${
              filters.category === cat
                ? 'bg-brand-primary text-text-primary border-brand-primary'
                : 'bg-neutral-50 text-[#999] border-neutral-200 hover:border-neutral-300 hover:text-[#666]'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Priority + Difficulty + Completed */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#999] mr-1">Priority</span>
        {PRIORITIES.map(pri => (
          <button
            key={pri}
            onClick={() => togglePriority(pri)}
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all ${
              filters.priority === pri
                ? 'bg-brand-primary text-text-primary border-brand-primary'
                : 'bg-neutral-50 text-[#999] border-neutral-200 hover:border-neutral-300 hover:text-[#666]'
            }`}
          >
            {pri}
          </button>
        ))}

        <span className="text-neutral-200 mx-1">|</span>

        <span className="text-[9px] font-bold uppercase tracking-widest text-[#999] mr-1">Difficulty</span>
        {DIFFICULTIES.map(diff => (
          <button
            key={diff}
            onClick={() => toggleDifficulty(diff)}
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all ${
              filters.difficulty === diff
                ? 'bg-brand-primary text-text-primary border-brand-primary'
                : 'bg-neutral-50 text-[#999] border-neutral-200 hover:border-neutral-300 hover:text-[#666]'
            }`}
          >
            {diff}
          </button>
        ))}

        <span className="text-neutral-200 mx-1">|</span>

        <button
          onClick={() => onFilterChange({ ...filters, showCompleted: !filters.showCompleted })}
          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all ${
            filters.showCompleted
              ? 'bg-brand-primary text-text-primary border-brand-primary'
              : 'bg-neutral-50 text-[#999] border-neutral-200 hover:border-neutral-300 hover:text-[#666]'
          }`}
        >
          Show Completed
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors ml-1 uppercase tracking-wider"
          >
            <XIcon className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
