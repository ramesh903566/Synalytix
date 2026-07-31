import { Sparkles, Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  isGenerating: boolean;
  lastGeneratedAt: string | null;
  onGenerate: () => void;
}

export default function GenerateButton({ isGenerating, lastGeneratedAt, onGenerate }: GenerateButtonProps) {
  const timeAgo = lastGeneratedAt ? getTimeAgo(lastGeneratedAt) : null;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-tertiary text-text-primary text-xs font-bold uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-brand-primary/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analysing your profiles…
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Regenerate Insights
          </>
        )}
      </button>
      {timeAgo && (
        <span className="text-[10px] text-[#999]">Last updated {timeAgo}</span>
      )}
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
