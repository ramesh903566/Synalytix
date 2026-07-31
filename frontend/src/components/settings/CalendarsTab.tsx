import { useState } from "react";
import { Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useCalendarConnections, useConnectGoogleCalendar, useDisconnectCalendar } from "../../hooks/useSettings";
import { cn } from "../../lib/utils";

export function CalendarsTab() {
  const { data: calendars, isLoading } = useCalendarConnections();
  const connectGoogle = useConnectGoogleCalendar();
  const disconnectCalendar = useDisconnectCalendar();

  const googleCal = calendars?.find((c) => c.provider === "google");

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-bg-sunken animate-pulse rounded-[var(--radius-card)]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-text-primary mb-1">Calendars</h2>
        <p className="text-xs text-text-muted">
          Connect your calendars to sync events with the Planner.
        </p>
      </div>

      <div className="space-y-3">
        {/* Google Calendar */}
        <div className="p-4 rounded-[var(--radius-card-inner)] border border-border bg-bg-canvas">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[var(--radius-badge)] bg-bg-elevated border border-border flex items-center justify-center">
                <span className="text-lg">📅</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">Google Calendar</span>
                  {googleCal ? (
                    <Badge variant="success">Connected</Badge>
                  ) : (
                    <Badge variant="outline">Not connected</Badge>
                  )}
                </div>
                {googleCal && (
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {googleCal.email}
                    {googleCal.lastSynced && ` · Last sync: ${formatRelativeTime(googleCal.lastSynced)}`}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {googleCal ? (
                <>
                  <button
                    onClick={() => window.location.href = "/api/auth/connect/google-calendar"}
                    className="w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center text-text-muted hover:bg-bg-sunken hover:text-text-primary transition-colors"
                    title="Re-sync"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Disconnect Google Calendar?")) {
                        disconnectCalendar.mutate();
                      }
                    }}
                    className="text-[10px] font-bold text-error-text bg-error-light border border-error-text/20 px-3 py-1.5 rounded-[var(--radius-badge)] hover:bg-error-text/10 transition-colors"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => connectGoogle.mutate()}
                  disabled={connectGoogle.isPending}
                >
                  {connectGoogle.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5" />
                      Connect
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Apple Calendar — Coming soon */}
        <div className="p-4 rounded-[var(--radius-card-inner)] border border-border bg-bg-canvas opacity-60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[var(--radius-badge)] bg-bg-elevated border border-border flex items-center justify-center">
                <span className="text-lg">🍎</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">Apple Calendar</span>
                  <Badge variant="outline">Coming soon</Badge>
                </div>
                <p className="text-[10px] text-text-muted mt-0.5">
                  Connect via ICS feed URL
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-text-muted bg-bg-sunken border border-border px-3 py-1.5 rounded-[var(--radius-badge)]">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Outlook — Coming soon */}
        <div className="p-4 rounded-[var(--radius-card-inner)] border border-border bg-bg-canvas opacity-60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[var(--radius-badge)] bg-bg-elevated border border-border flex items-center justify-center">
                <span className="text-lg">📨</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">Outlook Calendar</span>
                  <Badge variant="outline">Coming soon</Badge>
                </div>
                <p className="text-[10px] text-text-muted mt-0.5">
                  Connect via Microsoft OAuth
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-text-muted bg-bg-sunken border border-border px-3 py-1.5 rounded-[var(--radius-badge)]">
              Coming Soon
            </span>
          </div>
        </div>
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
