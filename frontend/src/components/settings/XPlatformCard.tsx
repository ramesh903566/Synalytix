import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2, RefreshCw } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface XPlatformCardProps {
  isConnected: boolean;
  username?: string | null;
  lastSynced?: string | null;
  capabilities?: string[];
  onConnect?: () => void;
  onDisconnect?: () => void;
}

const CAPABILITY_LABELS: Record<string, string> = {
  verified: "Verified",
  premium: "Premium+",
  creator: "Creator",
  analytics: "Analytics",
  articles: "Articles",
  media_studio: "Media Studio",
  long_posts: "Long Posts",
  edit_posts: "Edit Posts",
  radar: "Radar",
  reply_boost: "Reply Boost",
};

export function XPlatformCard({
  isConnected,
  username,
  lastSynced,
  capabilities = [],
  onConnect,
  onDisconnect,
}: XPlatformCardProps) {
  const [showCapabilities, setShowCapabilities] = useState(false);

  return (
    <div className="p-4 rounded-[var(--radius-card-inner)] border border-border bg-bg-canvas">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[var(--radius-badge)] bg-bg-elevated border border-border flex items-center justify-center font-bold text-sm overflow-hidden">
            <img src="/icons/x.jpeg" alt="X" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">X (Twitter)</span>
              {isConnected ? (
                <Badge variant="success">Connected</Badge>
              ) : (
                <Badge variant="outline">Not connected</Badge>
              )}
            </div>
            {isConnected && username && (
              <p className="text-[10px] text-text-muted mt-0.5">
                {username}
                {lastSynced && ` · Last sync: ${formatRelativeTime(lastSynced)}`}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              {capabilities.length > 0 && (
                <button
                  onClick={() => setShowCapabilities(!showCapabilities)}
                  className="flex items-center gap-1 text-[10px] font-medium text-text-muted hover:text-text-secondary transition-colors"
                >
                  {capabilities.length} capabilities
                  {showCapabilities ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
              <button
                onClick={onDisconnect}
                className="text-[10px] font-bold text-error-text bg-error-light border border-error-text/20 px-3 py-1.5 rounded-[var(--radius-badge)] hover:bg-error-text/10 transition-colors"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={onConnect}
              className="text-[10px] font-bold text-brand bg-brand-light border border-brand/20 px-3 py-1.5 rounded-[var(--radius-badge)] hover:bg-brand/10 transition-colors"
            >
              Connect
            </button>
          )}
        </div>
      </div>

      {/* Capabilities row */}
      {showCapabilities && capabilities.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border-light">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
            Detected Capabilities
          </p>
          <div className="flex flex-wrap gap-1.5">
            {capabilities.map((cap) => (
              <span
                key={cap}
                className="px-2 py-0.5 rounded-full bg-brand-light text-brand text-[10px] font-medium border border-brand/20"
              >
                {CAPABILITY_LABELS[cap] || cap}
              </span>
            ))}
          </div>
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
