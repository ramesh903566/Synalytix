import { X, Plus } from "lucide-react";
import { useChatStore, type ContextChip } from "../../store/chatStore";
import { cn } from "../../lib/utils";

export function ContextChips() {
  const { contextChips, removeContextChip } = useChatStore();

  if (contextChips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-4 py-2 border-b border-border-light">
      {contextChips.map((chip) => (
        <span
          key={chip.id}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border",
            chip.source === "auto"
              ? "bg-brand-light text-brand border-brand/20"
              : "bg-bg-sunken text-text-secondary border-border"
          )}
        >
          {chip.label}
          <button
            onClick={() => removeContextChip(chip.id)}
            className="w-3 h-3 rounded-full flex items-center justify-center hover:bg-brand/20 transition-colors"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </span>
      ))}
    </div>
  );
}
