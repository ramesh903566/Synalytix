import { useState } from "react";
import {
  Search,
  Pin,
  Archive,
  Trash2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { useChatHistory, useDeleteConversation, useUpdateConversation } from "../../hooks/useChat";
import { useChatStore } from "../../store/chatStore";
import { cn } from "../../lib/utils";

export function ChatHistoryPanel() {
  const { setActiveConversation, setShowHistory } = useChatStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pinned" | "archived">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const { data, isLoading } = useChatHistory(1, 50, search, filter);
  const deleteConv = useDeleteConversation();
  const updateConv = useUpdateConversation();

  const handleSelect = (id: string) => {
    setActiveConversation(id);
    setShowHistory(false);
  };

  const handleRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      updateConv.mutate({ id, title: editTitle.trim() });
    }
    setEditingId(null);
  };

  const handlePin = (id: string, currentPinned: boolean) => {
    updateConv.mutate({ id, pinned: !currentPinned });
  };

  const handleArchive = (id: string, currentArchived: boolean) => {
    updateConv.mutate({ id, archived: !currentArchived });
  };

  const handleDelete = (id: string) => {
    deleteConv.mutate(id);
  };

  const conversations = data?.conversations || [];

  return (
    <div className="flex flex-col h-full bg-bg-elevated border-r border-border">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-semibold text-text-primary flex-1">
            Chat History
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-border rounded-[var(--radius-input)] outline-none focus:border-brand bg-bg-canvas text-text-primary"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mt-2">
          {(["all", "pinned", "archived"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-2 py-1 text-[10px] font-medium rounded-full transition-colors capitalize",
                filter === f
                  ? "bg-brand-light text-brand"
                  : "text-text-muted hover:bg-bg-sunken"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="p-4 text-center text-xs text-text-muted">
            Loading...
          </div>
        )}

        {!isLoading && conversations.length === 0 && (
          <div className="p-4 text-center text-xs text-text-muted">
            No conversations yet
          </div>
        )}

        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="group px-3 py-2.5 border-b border-border-light hover:bg-bg-sunken/50 cursor-pointer transition-colors"
            onClick={() => handleSelect(conv.id)}
          >
            <div className="flex items-start gap-2">
              {editingId === conv.id ? (
                <div className="flex-1 flex items-center gap-1">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveRename(conv.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="flex-1 text-xs px-2 py-1 border border-brand rounded bg-bg-canvas text-text-primary outline-none"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveRename(conv.id);
                    }}
                    className="w-5 h-5 flex items-center justify-center text-success hover:bg-success/10 rounded"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(null);
                    }}
                    className="w-5 h-5 flex items-center justify-center text-text-muted hover:bg-bg-sunken rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {conv.pinned && (
                        <Pin className="w-3 h-3 text-brand shrink-0" />
                      )}
                      <p className="text-xs font-medium text-text-primary truncate">
                        {conv.title}
                      </p>
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {conv.model_provider} ·{" "}
                      {new Date(conv.updated_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRename(conv.id, conv.title);
                      }}
                      className="w-5 h-5 flex items-center justify-center text-text-muted hover:text-text-primary rounded"
                      title="Rename"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePin(conv.id, conv.pinned);
                      }}
                      className={cn(
                        "w-5 h-5 flex items-center justify-center rounded",
                        conv.pinned
                          ? "text-brand"
                          : "text-text-muted hover:text-text-primary"
                      )}
                      title={conv.pinned ? "Unpin" : "Pin"}
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchive(conv.id, conv.archived);
                      }}
                      className="w-5 h-5 flex items-center justify-center text-text-muted hover:text-text-primary rounded"
                      title={conv.archived ? "Unarchive" : "Archive"}
                    >
                      <Archive className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(conv.id);
                      }}
                      className="w-5 h-5 flex items-center justify-center text-text-muted hover:text-error rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
