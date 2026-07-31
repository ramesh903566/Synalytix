import { useRef, useEffect, memo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Copy, RefreshCw, Trash2, Pin, Pencil } from "lucide-react";
import { cn } from "../../lib/utils";
import type { ChatMessage as ChatMessageType } from "../../lib/chat-api";

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
  onCopy?: (content: string) => void;
  onRegenerate?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
  onEdit?: () => void;
}

export const ChatMessage = memo(function ChatMessage({
  message,
  isStreaming,
  onCopy,
  onRegenerate,
  onDelete,
  onPin,
  onEdit,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "group px-4 py-3 relative",
        isUser ? "bg-transparent" : "bg-bg-sunken/50"
      )}
    >
      <div className="max-w-none">
        {/* Role label */}
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider",
              isUser ? "text-brand" : "text-text-muted"
            )}
          >
            {isUser ? "You" : "Synalytix AI"}
          </span>
          {isStreaming && (
            <span className="inline-flex gap-0.5">
              <span className="w-1 h-1 rounded-full bg-brand animate-bounce [animation-delay:0ms]" />
              <span className="w-1 h-1 rounded-full bg-brand animate-bounce [animation-delay:150ms]" />
              <span className="w-1 h-1 rounded-full bg-brand animate-bounce [animation-delay:300ms]" />
            </span>
          )}
        </div>

        {/* Content */}
        <div
          className={cn(
            "text-sm leading-relaxed prose prose-sm max-w-none",
            "prose-p:my-1 prose-pre:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0",
            "prose-code:text-xs prose-code:bg-bg-sunken prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
            "prose-pre:bg-text-primary prose-pre:text-text-inverse prose-pre:p-3 prose-pre:rounded-[var(--radius-card-inner)]",
            "prose-table:text-xs prose-th:text-left prose-th:font-semibold prose-th:p-2 prose-td:p-2",
            isUser ? "text-text-primary" : "text-text-primary"
          )}
        >
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {message.content}
          </Markdown>
        </div>

        {/* Timestamp */}
        <div className="mt-1.5 text-[10px] text-text-muted">
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* Hover actions */}
      {isAssistant && !isStreaming && (
        <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onCopy?.(message.content)}
            className="w-7 h-7 rounded-[var(--radius-button)] flex items-center justify-center text-text-muted hover:bg-bg-sunken hover:text-text-primary transition-colors"
            title="Copy"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRegenerate}
            className="w-7 h-7 rounded-[var(--radius-button)] flex items-center justify-center text-text-muted hover:bg-bg-sunken hover:text-text-primary transition-colors"
            title="Regenerate"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onEdit}
            className="w-7 h-7 rounded-[var(--radius-button)] flex items-center justify-center text-text-muted hover:bg-bg-sunken hover:text-text-primary transition-colors"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onPin}
            className={cn(
              "w-7 h-7 rounded-[var(--radius-button)] flex items-center justify-center transition-colors",
              message.pinned
                ? "text-brand bg-brand-light"
                : "text-text-muted hover:bg-bg-sunken hover:text-text-primary"
            )}
            title="Pin"
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-[var(--radius-button)] flex items-center justify-center text-text-muted hover:bg-error-light hover:text-error transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
});
