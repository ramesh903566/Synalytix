import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatComposer } from "./ChatComposer";
import { ChatHistoryPanel } from "./ChatHistoryPanel";
import { ContextChips } from "./ContextChips";
import { getQuickActions } from "./QuickActions";
import { useChatStore } from "../../store/chatStore";
import { useConversation, useCreateConversation } from "../../hooks/useChat";
import { usePageContext } from "../../hooks/usePageContext";
import { sendMessageStream, type ChatMessage } from "../../lib/chat-api";
import { MessageSquare } from "lucide-react";

export function ChatPanel() {
  const {
    isOpen,
    setOpen,
    activeConversationId,
    setActiveConversation,
    isStreaming,
    setStreaming,
    selectedModel,
    showHistory,
    contextChips,
  } = useChatStore();

  const { page } = usePageContext();
  const createConv = useCreateConversation();
  const { data: conversation } = useConversation(activeConversationId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  // Sync messages from conversation data
  useEffect(() => {
    if (conversation?.messages) {
      setMessages(conversation.messages);
    } else {
      setMessages([]);
    }
  }, [conversation]);

  // Global keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!useChatStore.getState().isOpen);
      }
      if (e.key === "Escape" && useChatStore.getState().isOpen) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setOpen]);

  const handleSend = useCallback(
    async (content: string) => {
      // Create conversation if none active
      let convId = activeConversationId;
      if (!convId) {
        const newConv = await createConv.mutateAsync({
          title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
          model_provider: selectedModel?.provider || "openai",
          model_name: selectedModel?.model || "gpt-4o",
        });
        convId = newConv.id;
        setActiveConversation(convId);
      }

      // Add user message optimistically
      const userMsg: ChatMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: convId!,
        role: "user",
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Start streaming
      setStreaming(true);
      setStreamingContent("");

      // Build context payload from chips
      const context: Record<string, unknown> = { page };
      contextChips.forEach((chip) => {
        context[chip.id] = chip.value;
      });

      let fullResponse = "";

      await sendMessageStream(convId!, content, context, {
        onToken: (token) => {
          fullResponse += token;
          setStreamingContent(fullResponse);
        },
        onComplete: (fullText) => {
          // Add assistant message
          const assistantMsg: ChatMessage = {
            id: `assistant-${Date.now()}`,
            conversation_id: convId!,
            role: "assistant",
            content: fullResponse,
            created_at: new Date().toISOString(),
          };
          setMessages((prev) => [
            ...prev.filter((m) => !m.id.startsWith("temp-")),
            userMsg,
            assistantMsg,
          ]);
          setStreaming(false);
          setStreamingContent("");
        },
        onError: (error) => {
          setStreaming(false);
          setStreamingContent("");
          // Remove optimistic user message on error
          setMessages((prev) => prev.filter((m) => !m.id.startsWith("temp-")));
        },
      });
    },
    [
      activeConversationId,
      selectedModel,
      contextChips,
      page,
      createConv,
      setActiveConversation,
      setStreaming,
    ]
  );

  const handleStop = () => {
    abortRef.current?.abort();
    setStreaming(false);
    setStreamingContent("");
  };

  const quickActions = getQuickActions(page);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — subtle blur behind panel only */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-[460px] bg-bg-elevated border-l border-border shadow-level-3 z-50 flex flex-col"
          >
            <ChatHeader />

            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* History sidebar (toggleable) */}
              {showHistory && (
                <div className="w-64 border-r border-border shrink-0">
                  <ChatHistoryPanel />
                </div>
              )}

              {/* Main chat area */}
              <div className="flex-1 flex flex-col min-w-0">
                <ContextChips />

                {/* Messages or empty state */}
                {messages.length === 0 && !isStreaming ? (
                  <div className="flex-1 flex flex-col items-center justify-center px-6">
                    <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center mb-4">
                      <MessageSquare className="w-6 h-6 text-brand" />
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary mb-1">
                      How can I help?
                    </h3>
                    <p className="text-xs text-text-muted text-center mb-6 max-w-[240px]">
                      Ask anything about your analytics, content strategy, or
                      career growth.
                    </p>

                    {/* Quick actions */}
                    <div className="flex flex-wrap gap-2 justify-center max-w-[320px]">
                      {quickActions.map((action) => (
                        <button
                          key={action.label}
                          onClick={() => handleSend(action.prompt)}
                          className="px-3 py-1.5 text-[11px] font-medium rounded-full border border-border text-text-secondary hover:bg-bg-sunken hover:text-text-primary transition-colors"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <ChatMessageList
                    messages={messages}
                    isStreaming={isStreaming}
                    onCopy={(content) =>
                      navigator.clipboard.writeText(content)
                    }
                    onRegenerate={(id) => {
                      // Find the message and resend from that point
                      const msg = messages.find((m) => m.id === id);
                      if (msg) {
                        setMessages((prev) =>
                          prev.filter(
                            (m) =>
                              m.created_at < msg.created_at ||
                              m.id === msg.id
                          )
                        );
                        handleSend(msg.content);
                      }
                    }}
                    onDelete={(id) =>
                      setMessages((prev) => prev.filter((m) => m.id !== id))
                    }
                  />
                )}

                {/* Streaming indicator */}
                {isStreaming && streamingContent && (
                  <div className="px-4 py-2">
                    <div className="text-xs text-text-muted italic">
                      Synalytix AI is responding...
                    </div>
                  </div>
                )}

                <ChatComposer onSend={handleSend} onStop={handleStop} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
