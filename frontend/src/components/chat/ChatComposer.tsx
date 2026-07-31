import { useState, useRef, useCallback, useEffect } from "react";
import { Send, Paperclip, Square } from "lucide-react";
import { Button } from "../ui/button";
import { useChatStore } from "../../store/chatStore";
import { cn } from "../../lib/utils";

interface ChatComposerProps {
  onSend: (content: string) => void;
  onStop?: () => void;
}

export function ChatComposer({ onSend, onStop }: ChatComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isStreaming } = useChatStore();

  const maxLength = 8000;
  const charCount = value.length;

  // Auto-expand textarea
  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setValue("");
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border bg-bg-elevated p-3 shrink-0">
      <div className="flex items-end gap-2 bg-bg-canvas border border-border rounded-[var(--radius-card)] px-3 py-2 focus-within:border-brand transition-colors">
        <button
          className="w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-bg-sunken transition-colors shrink-0 mb-0.5"
          title="Attach file"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Synalytix AI..."
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none leading-relaxed min-h-[32px] max-h-[200px] py-1"
          disabled={isStreaming}
        />

        <div className="flex items-center gap-2 shrink-0 mb-0.5">
          {charCount > 0 && (
            <span
              className={cn(
                "text-[10px] tabular-nums",
                charCount > maxLength ? "text-error" : "text-text-muted"
              )}
            >
              {charCount}/{maxLength}
            </span>
          )}

          {isStreaming ? (
            <button
              onClick={onStop}
              className="w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center bg-error/10 text-error hover:bg-error/20 transition-colors"
              title="Stop generation"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!value.trim() || charCount > maxLength}
              className={cn(
                "w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center transition-colors",
                value.trim() && charCount <= maxLength
                  ? "bg-brand text-text-inverse hover:bg-brand-hover"
                  : "bg-bg-sunken text-text-muted cursor-not-allowed"
              )}
              title="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
