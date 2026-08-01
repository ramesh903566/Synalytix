import { APP_REGISTRY } from "../../lib/appRegistry";
import { useAppContext } from "../../context/AppContext";
import { usePlatformConnections, useDisconnectPlatform } from "../../hooks/useSettings";
import { LeetCodeCard } from "./LeetCodeCard";
import { XPlatformCard } from "./XPlatformCard";
import { connectPlatform } from "../../lib/api";
import { useState } from "react";
import toast from "react-hot-toast";

const BACKEND_APPS = new Set(["github", "instagram", "x", "linkedin", "leetcode"]);

export function IntegrationsTab() {
  const { connectedApps } = useAppContext();
  const { data: connections } = usePlatformConnections();
  const disconnect = useDisconnectPlatform();
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);

  const getConnection = (platform: string) =>
    connections?.find((c) => c.platform === platform);

  const handleConnect = async (platform: string) => {
    setConnectingPlatform(platform);
    try {
      await connectPlatform(platform);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start OAuth connection";
      toast.error(message);
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = (platform: string) => {
    if (confirm(`Disconnect ${platform}?`)) {
      disconnect.mutate(platform);
    }
  };

  // Separate LeetCode and X for special rendering
  const regularApps = APP_REGISTRY.filter(
    (app) => app.id !== "leetcode" && app.id !== "x"
  );
  const xApp = APP_REGISTRY.find((app) => app.id === "x");
  const leetcodeApp = APP_REGISTRY.find((app) => app.id === "leetcode");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-text-primary mb-1">Integrations</h2>
        <p className="text-xs text-text-muted">
          Manage your connected platforms and data sources.
        </p>
      </div>

      <div className="space-y-3">
        {/* X (Twitter) — special card with capabilities */}
        {xApp && (
          <XPlatformCard
            isConnected={connectedApps.includes("x" as any)}
            username={getConnection("x")?.platform_username}
            lastSynced={getConnection("x")?.last_synced}
            capabilities={(getConnection("x") as any)?.xCapabilities || []}
            onConnect={() => handleConnect("x")}
            onDisconnect={() => handleDisconnect("x")}
          />
        )}

        {/* Regular OAuth platforms */}
        {regularApps.map((app) => {
          const isConn = connectedApps.includes(app.id as any);
          const isSupported = BACKEND_APPS.has(app.id);
          const conn = getConnection(app.id);

          return (
            <div
              key={app.id}
              className="flex items-center justify-between p-4 rounded-[var(--radius-card-inner)] border border-border bg-bg-canvas"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[var(--radius-badge)] bg-bg-elevated border border-border flex items-center justify-center font-bold text-sm overflow-hidden">
                  <img src={app.iconUrl} alt={app.name} className="w-full h-full object-cover scale-[1.15]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">{app.name}</div>
                  <div className="text-[10px] text-text-muted">
                    {isConn
                      ? `Connected and syncing${conn?.last_synced ? ` · Last sync: ${formatRelativeTime(conn.last_synced)}` : ""}`
                      : isSupported
                      ? "Click connect to link your account"
                      : "Coming soon"}
                  </div>
                </div>
              </div>
              {isConn ? (
                <button
                  onClick={() => handleDisconnect(app.id)}
                  className="text-[10px] font-bold text-error-text bg-error-light border border-error-text/20 px-3 py-1.5 rounded-[var(--radius-badge)] hover:bg-error-text/10 transition-colors"
                >
                  Disconnect
                </button>
              ) : isSupported ? (
                <button
                  onClick={() => handleConnect(app.id)}
                  disabled={connectingPlatform === app.id}
                  className="text-[10px] font-bold text-brand bg-brand-light border border-brand/20 px-3 py-1.5 rounded-[var(--radius-badge)] hover:bg-brand/10 transition-colors"
                >
                  {connectingPlatform === app.id ? "Connecting..." : "Connect"}
                </button>
              ) : (
                <span className="text-[10px] font-bold text-text-muted bg-bg-sunken border border-border px-3 py-1.5 rounded-[var(--radius-badge)]">
                  Coming Soon
                </span>
              )}
            </div>
          );
        })}

        {/* LeetCode — username-based, distinct card */}
        {leetcodeApp && (
          <LeetCodeCard
            isConnected={connectedApps.includes("leetcode" as any)}
            username={getConnection("leetcode")?.platform_username}
            lastSynced={getConnection("leetcode")?.last_synced}
          />
        )}
      </div>
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
