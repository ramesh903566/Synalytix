import * as React from "react"
import { cn } from "../../lib/utils"
import { motion, AnimatePresence } from "motion/react"
import { Bell, Activity } from "lucide-react"

export interface Notification {
  id: string | number
  title: string
  subtitle?: string
  time: string
  read: boolean
}

export interface NotificationPopoverProps {
  notifications: Notification[]
  onMarkAllRead: () => void
  className?: string
}

export function NotificationPopover({ notifications, onMarkAllRead, className }: NotificationPopoverProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter((n) => !n.read).length

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-[var(--radius-card-inner)] hover:bg-bg-sunken flex items-center justify-center transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-[18px] h-[18px] text-text-secondary" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-bg-elevated" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute top-full right-0 mt-2 w-[340px] bg-bg-elevated border border-border rounded-[var(--radius-card)] shadow-level-3 z-50 overflow-hidden",
              className
            )}
          >
            <div className="p-4 border-b border-border-light flex justify-between items-center">
              <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-error-light text-error-text px-2 py-0.5 rounded-[var(--radius-pill)] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {notifications.length === 0 && (
                <div className="p-8 text-center text-xs text-text-muted">No notifications yet.</div>
              )}
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "p-4 border-b border-border-light last:border-0 hover:bg-bg-canvas transition-colors flex gap-3",
                    !notif.read && "bg-brand-light/30"
                  )}
                >
                  <div className="w-8 h-8 rounded-[var(--radius-card-inner)] bg-bg-sunken flex items-center justify-center shrink-0 relative">
                    <Activity className="w-4 h-4 text-text-muted" />
                    {!notif.read && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-error rounded-full ring-1 ring-bg-elevated" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-xs text-text-primary", !notif.read ? "font-semibold" : "font-medium")}>{notif.title}</p>
                    {notif.subtitle && <p className="text-[11px] text-text-muted mt-0.5">{notif.subtitle}</p>}
                  </div>
                  <span className="text-[10px] text-text-muted whitespace-nowrap shrink-0">{notif.time}</span>
                </div>
              ))}
            </div>
            <button
              onClick={onMarkAllRead}
              disabled={unreadCount === 0}
              className="w-full p-3 border-t border-border-light bg-bg-canvas text-center hover:bg-bg-sunken transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="text-xs font-semibold text-brand">Mark all as read</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
