import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ContextChip {
  id: string;
  label: string;
  value: string;
  source: "auto" | "manual";
}

export interface ChatModel {
  provider: string;
  model: string;
}

interface ChatState {
  isOpen: boolean;
  activeConversationId: string | null;
  isStreaming: boolean;
  streamingMessageId: string | null;
  selectedModel: ChatModel | null;
  contextChips: ContextChip[];
  showHistory: boolean;

  togglePanel: () => void;
  setOpen: (open: boolean) => void;
  setActiveConversation: (id: string | null) => void;
  setStreaming: (streaming: boolean, messageId?: string | null) => void;
  setSelectedModel: (model: ChatModel | null) => void;
  setContextChips: (chips: ContextChip[]) => void;
  addContextChip: (chip: ContextChip) => void;
  removeContextChip: (id: string) => void;
  setShowHistory: (show: boolean) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      isOpen: false,
      activeConversationId: null,
      isStreaming: false,
      streamingMessageId: null,
      selectedModel: null,
      contextChips: [],
      showHistory: false,

      togglePanel: () => set((s) => ({ isOpen: !s.isOpen })),
      setOpen: (open) => set({ isOpen: open }),
      setActiveConversation: (id) => set({ activeConversationId: id }),
      setStreaming: (streaming, messageId = null) =>
        set({ isStreaming: streaming, streamingMessageId: messageId }),
      setSelectedModel: (model) => set({ selectedModel: model }),
      setContextChips: (chips) => set({ contextChips: chips }),
      addContextChip: (chip) =>
        set((s) => ({ contextChips: [...s.contextChips, chip] })),
      removeContextChip: (id) =>
        set((s) => ({ contextChips: s.contextChips.filter((c) => c.id !== id) })),
      setShowHistory: (show) => set({ showHistory: show }),
      reset: () =>
        set({
          activeConversationId: null,
          isStreaming: false,
          streamingMessageId: null,
          contextChips: [],
          showHistory: false,
        }),
    }),
    {
      name: "synalytix-chat",
      partialize: (state) => ({
        isOpen: state.isOpen,
        selectedModel: state.selectedModel,
      }),
    }
  )
);
