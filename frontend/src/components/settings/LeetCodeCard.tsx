import { useState } from "react";
import { Loader2, RefreshCw, Pencil, AlertCircle, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useConnectLeetCode, useSyncLeetCode, useDisconnectPlatform } from "../../hooks/useSettings";
import { cn } from "../../lib/utils";

interface LeetCodeCardProps {
  isConnected: boolean;
  username?: string | null;
  lastSynced?: string | null;
}

export function LeetCodeCard({ isConnected, username, lastSynced }: LeetCodeCardProps) {
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const connectLeetCode = useConnectLeetCode();
  const syncLeetCode = useSyncLeetCode();
  const disconnect = useDisconnectPlatform();

  const handleConnect = () => {
    if (!newUsername.trim()) return;
    connectLeetCode.mutate(newUsername.trim(), {
      onSuccess: () => {
        setEditing(false);
        setNewUsername("");
      },
    });
  };

  const handleSync = () => {
    syncLeetCode.mutate();
  };

  const handleDisconnect = () => {
    if (confirm("Stop tracking this LeetCode profile?")) {
      disconnect.mutate("leetcode");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-[var(--radius-card-inner)] border border-border bg-bg-canvas">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-[var(--radius-badge)] bg-bg-elevated border border-border flex items-center justify-center font-bold text-sm overflow-hidden">
          <img src="/icons/leetcode.png" alt="LeetCode" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text-primary">LeetCode</span>
            {isConnected ? (
              <Badge variant="success">Connected</Badge>
            ) : (
              <Badge variant="outline">Not connected</Badge>
            )}
          </div>
          {isConnected && username && (
            <p className="text-[10px] text-text-muted mt-0.5">
              @{username}
              {lastSynced && ` · Last sync: ${formatRelativeTime(lastSynced)}`}
            </p>
          )}
          {!isConnected && !editing && (
            <p className="text-[10px] text-text-muted mt-0.5">
              Username-based tracking (no OAuth required)
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isConnected ? (
          <>
            <button
              onClick={handleSync}
              disabled={syncLeetCode.isPending}
              className="w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center text-text-muted hover:bg-bg-sunken hover:text-text-primary transition-colors"
              title="Sync now"
            >
              {syncLeetCode.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={() => { setEditing(true); setNewUsername(username || ""); }}
              className="w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center text-text-muted hover:bg-bg-sunken hover:text-text-primary transition-colors"
              title="Change username"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDisconnect}
              className="text-[10px] font-bold text-error-text bg-error-light border border-error-text/20 px-3 py-1.5 rounded-[var(--radius-badge)] hover:bg-error-text/10 transition-colors"
            >
              Stop tracking
            </button>
          </>
        ) : editing ? (
          <div className="flex items-center gap-2">
            <Input
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="LeetCode username"
              className="w-40 h-8 text-xs"
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            />
            <Button
              variant="default"
              size="sm"
              onClick={handleConnect}
              disabled={!newUsername.trim() || connectLeetCode.isPending}
            >
              {connectLeetCode.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Connect"
              )}
            </Button>
            <button
              onClick={() => setEditing(false)}
              className="text-xs text-text-muted hover:text-text-primary"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-[10px] font-bold text-brand bg-brand-light border border-brand/20 px-3 py-1.5 rounded-[var(--radius-badge)] hover:bg-brand/10 transition-colors"
          >
            Connect
          </button>
        )}
      </div>

      {connectLeetCode.isError && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-error-light border border-error/20 rounded text-[10px] text-error flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {connectLeetCode.error.message}
        </div>
      )}
    </div>
  );
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}
