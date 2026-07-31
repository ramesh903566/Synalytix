import { useRef, useEffect, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChatMessage } from "./ChatMessage";
import { useChatStore } from "../../store/chatStore";
import type { ChatMessage as ChatMessageType } from "../../lib/chat-api";
import { Loader2 } from "lucide-react";

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isStreaming?: boolean;
  onCopy?: (content: string) => void;
  onRegenerate?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onPin?: (messageId: string) => void;
  onEdit?: (messageId: string) => void;
}

export function ChatMessageList({
  messages,
  isStreaming,
  onCopy,
  onRegenerate,
  onDelete,
  onPin,
  onEdit,
}: ChatMessageListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { streamingMessageId } = useChatStore();

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      virtualizer.scrollToIndex(messages.length - 1, { align: "end" });
    }
  }, [messages.length, virtualizer]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div ref={parentRef} className="flex-1 overflow-y-auto">
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const msg = messages[virtualRow.index];
          return (
            <div
              key={msg.id}
              ref={virtualizer.measureElement}
              data-index={virtualRow.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <ChatMessage
                message={msg}
                isStreaming={
                  isStreaming && streamingMessageId === msg.id
                }
                onCopy={onCopy}
                onRegenerate={() => onRegenerate?.(msg.id)}
                onDelete={() => onDelete?.(msg.id)}
                onPin={() => onPin?.(msg.id)}
                onEdit={() => onEdit?.(msg.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
