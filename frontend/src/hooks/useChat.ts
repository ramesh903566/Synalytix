import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchModels,
  fetchChatHistory,
  getConversation,
  createConversation,
  updateConversation,
  deleteConversation,
  type ProviderModel,
  type ChatConversation,
  type ChatMessage,
  type ChatHistoryResponse,
} from "../lib/chat-api";

// ─── Models ─────────────────────────────────────────────────────────────────

export function useModels() {
  return useQuery<ProviderModel[]>({
    queryKey: ["ai-models"],
    queryFn: fetchModels,
    staleTime: 30_000,
  });
}

// ─── Conversation History ───────────────────────────────────────────────────

export function useChatHistory(
  page = 1,
  limit = 20,
  search = "",
  filter = "all"
) {
  return useQuery<ChatHistoryResponse>({
    queryKey: ["chat-history", page, limit, search, filter],
    queryFn: () => fetchChatHistory(page, limit, search, filter),
    staleTime: 10_000,
  });
}

// ─── Single Conversation ────────────────────────────────────────────────────

export function useConversation(id: string | null) {
  return useQuery<ChatConversation & { messages: ChatMessage[] }>({
    queryKey: ["conversation", id],
    queryFn: () => getConversation(id!),
    enabled: !!id,
    staleTime: 5_000,
  });
}

// ─── Create Conversation ────────────────────────────────────────────────────

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ title, model_provider, model_name }: { title?: string; model_provider?: string; model_name?: string }) =>
      createConversation(title, model_provider, model_name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chat-history"] });
    },
  });
}

// ─── Update Conversation ────────────────────────────────────────────────────

export function useUpdateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; title?: string; pinned?: boolean; archived?: boolean; model_provider?: string; model_name?: string }) =>
      updateConversation(vars.id, {
        title: vars.title,
        pinned: vars.pinned,
        archived: vars.archived,
        model_provider: vars.model_provider,
        model_name: vars.model_name,
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["chat-history"] });
      qc.invalidateQueries({ queryKey: ["conversation", variables.id] });
    },
  });
}

// ─── Delete Conversation ────────────────────────────────────────────────────

export function useDeleteConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteConversation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chat-history"] });
    },
  });
}
