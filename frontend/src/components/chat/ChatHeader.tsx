import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  History,
  Settings,
  Plus,
  Maximize2,
  Minimize2,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useChatStore, type ChatModel } from "../../store/chatStore";
import { useModels } from "../../hooks/useChat";
import { ModelSelector } from "./ModelSelector";
import { cn } from "../../lib/utils";

export function ChatHeader() {
  const {
    activeConversationId,
    selectedModel,
    setSelectedModel,
    showHistory,
    setShowHistory,
    setOpen,
    reset,
  } = useChatStore();

  const { data: models } = useModels();
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleNewChat = () => {
    reset();
  };

  const currentModel = selectedModel
    ? models?.find(
        (m) =>
          m.provider === selectedModel.provider &&
          m.model === selectedModel.model
      )
    : models?.[0];

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-bg-elevated shrink-0">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0">
        <MessageSquare className="w-4 h-4 text-text-inverse" />
      </div>

      {/* Title + Model Badge */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary truncate">
            Synalytix AI
          </span>
          {currentModel && (
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-bg-sunken border border-border text-[10px] font-medium text-text-secondary hover:bg-bg-canvas transition-colors"
            >
              {currentModel.displayName}
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  currentModel.isActive ? "bg-success" : "bg-text-muted"
                )}
              />
            </button>
          )}
          {!models && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-bg-sunken border border-border text-[10px] text-text-muted">
              <Loader2 className="w-3 h-3 animate-spin" />
              Loading
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleNewChat}
          className="w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center text-text-secondary hover:bg-bg-sunken hover:text-text-primary transition-colors"
          title="New chat"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={cn(
            "w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center transition-colors",
            showHistory
              ? "bg-brand-light text-brand"
              : "text-text-secondary hover:bg-bg-sunken hover:text-text-primary"
          )}
          title="Chat history"
        >
          <History className="w-4 h-4" />
        </button>
        <a
          href="/app/settings"
          className="w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center text-text-secondary hover:bg-bg-sunken hover:text-text-primary transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </a>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center text-text-secondary hover:bg-bg-sunken hover:text-text-primary transition-colors"
          title={expanded ? "Shrink" : "Expand"}
        >
          {expanded ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center text-text-secondary hover:bg-bg-sunken hover:text-text-primary transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Model Selector Popover */}
      <AnimatePresence>
        {showModelSelector && (
          <ModelSelector
            onClose={() => setShowModelSelector(false)}
            onSelect={(model: ChatModel) => {
              setSelectedModel(model);
              setShowModelSelector(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
