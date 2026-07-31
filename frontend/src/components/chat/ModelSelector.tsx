import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useModels } from "../../hooks/useChat";
import { useChatStore, type ChatModel } from "../../store/chatStore";
import { cn } from "../../lib/utils";

interface ModelSelectorProps {
  onClose: () => void;
  onSelect: (model: ChatModel) => void;
}

export function ModelSelector({ onClose, onSelect }: ModelSelectorProps) {
  const { data: models } = useModels();
  const { selectedModel } = useChatStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // Group models by provider
  const grouped = (models || []).reduce(
    (acc, m) => {
      if (!acc[m.provider]) acc[m.provider] = [];
      acc[m.provider].push(m);
      return acc;
    },
    {} as Record<string, typeof models>
  );

  const providerLabels: Record<string, string> = {
    anthropic: "Anthropic",
    openai: "OpenAI",
    gemini: "Google Gemini",
    deepseek: "DeepSeek",
    grok: "xAI Grok",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full left-0 mt-1 w-72 bg-bg-elevated border border-border rounded-[var(--radius-card)] shadow-level-3 z-50 overflow-hidden"
    >
      <div className="p-2 border-b border-border-light">
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-2">
          Select Model
        </p>
      </div>

      <div className="max-h-64 overflow-y-auto p-1">
        {models && models.length === 0 && (
          <div className="p-4 text-center text-xs text-text-muted">
            No models configured. Add a provider in Settings.
          </div>
        )}

        {Object.entries(grouped).map(([provider, providerModels]) => (
          <div key={provider} className="mb-1">
            <div className="px-2 py-1.5 text-[10px] font-semibold text-text-muted">
              {providerLabels[provider] || provider}
            </div>
            {providerModels!.map((m) => {
              const isSelected =
                selectedModel?.provider === m.provider &&
                selectedModel?.model === m.model;
              return (
                <button
                  key={m.id}
                  onClick={() =>
                    onSelect({ provider: m.provider, model: m.model })
                  }
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-2 rounded-[var(--radius-card-inner)] text-left transition-colors",
                    isSelected
                      ? "bg-brand-light text-brand"
                      : "text-text-primary hover:bg-bg-sunken"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">
                      {m.displayName}
                    </div>
                    <div className="text-[10px] text-text-muted truncate">
                      {m.model}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        m.isActive ? "bg-success" : "bg-text-muted"
                      )}
                    />
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand" />}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
