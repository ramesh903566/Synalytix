import * as React from "react"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"
import { NotificationPopover, type Notification } from "../dashboard/notification-popover"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Menu, MessageSquare, Search } from "lucide-react"
import { MOCK_APPS } from "../../data/mockData"
import { useAppContext } from "../../context/AppContext"
import { useChatStore } from "../../store/chatStore"

export interface TopBarProps {
  onMenuClick?: () => void
  showMenu?: boolean
  onSearchOpen?: () => void
}

const pageTitles: Record<string, string> = {
  "/app": "Dashboard",
  "/app/studio": "Studio",
  "/app/apps": "Apps",
  "/app/analytics": "Analytics",
  "/app/recommendations": "AI Recommendations",
  "/app/planner": "Planner",
  "/app/settings": "Settings",
}

export function TopBar({ onMenuClick, showMenu, onSearchOpen }: TopBarProps) {
  const { connectedApps: connectedAppIds } = useAppContext()
  const connectedApps = MOCK_APPS.filter(app => connectedAppIds.includes(app.id as any))
  const navigate = useNavigate()
  const location = useLocation()
  const { isOpen: isChatOpen, togglePanel: toggleChat } = useChatStore()
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: "Post Published", subtitle: "X (Twitter)", time: "5m ago", read: false },
    { id: 2, title: "Insight Generated", subtitle: "Instagram", time: "12m ago", read: false },
    { id: 3, title: "Draft Saved", subtitle: "LinkedIn", time: "1h ago", read: true },
  ])

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  const isHome = location.pathname === "/app"
  const pageTitle = pageTitles[location.pathname] || "Synalytix"

  return (
    <header className="h-[var(--topbar-height)] border-b border-border bg-bg-elevated flex items-center px-6 gap-4 shrink-0">
      {/* Mobile menu button */}
      {showMenu && (
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-[var(--radius-card-inner)] flex items-center justify-center hover:bg-bg-sunken transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-text-secondary" />
        </button>
      )}

      {/* Greeting / Page Title */}
      <div className="flex-none min-w-0 mr-4">
        {isHome ? (
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs text-text-muted mt-0.5">Here's what's happening with your platforms today.</p>
          </div>
        ) : (
          <h1 className="text-lg font-semibold text-text-primary tracking-tight">{pageTitle}</h1>
        )}
      </div>

      {/* Connected Apps Circles */}
      <div className="flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar mask-gradient-right pl-2">
        {connectedApps.map((app) => {
          const isActive = location.pathname.split('/').includes(app.id);
          return (
            <button 
              key={app.id}
              onClick={() => navigate(`/app/apps/${app.id}`)}
              className={cn(
                "flex-shrink-0 rounded-full p-[2px] transition-all hover:scale-110 focus:outline-none",
                isActive 
                  ? "w-11 h-11 bg-gradient-to-tr from-[#10b981] to-[#34d399] shadow-sm shadow-[#10b981]/40" 
                  : "w-8 h-8 bg-border hover:bg-[#10b981]/60 opacity-70 hover:opacity-100"
              )}
              title={`View ${app.name} analytics`}
            >
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-[2px]">
                <img 
                  src={app.iconUrl} 
                  alt={app.name} 
                  className="w-full h-full object-cover rounded-full" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${app.name}&background=random`;
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <button
        onClick={onSearchOpen}
        className="hidden md:flex items-center gap-2 h-9 px-3 rounded-[var(--radius-card-inner)] border border-border bg-bg-sunken text-sm text-text-muted hover:text-text-secondary hover:border-border-light transition-colors w-64 lg:w-80"
      >
        <Search className="w-3.5 h-3.5 shrink-0" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-bg-elevated border border-border">⌘K</kbd>
      </button>

      {/* Chat Toggle */}
      <button
        onClick={toggleChat}
        className={cn(
          "w-9 h-9 rounded-[var(--radius-card-inner)] flex items-center justify-center transition-colors",
          isChatOpen
            ? "bg-brand-light text-brand"
            : "hover:bg-bg-sunken text-text-secondary"
        )}
        title="Toggle AI Chat (⌘K)"
        aria-label="Toggle AI Chat panel"
      >
        <MessageSquare className="w-[18px] h-[18px]" />
      </button>

      {/* Notifications */}
      <NotificationPopover notifications={notifications} onMarkAllRead={markAllRead} />

      {/* User Avatar */}
      <button
        onClick={() => navigate("/app/settings")}
        className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-elevated rounded-full"
        aria-label="User settings"
      >
        <Avatar className="w-9 h-9 hover:ring-2 hover:ring-brand/20 transition-all">
          <AvatarFallback className="text-xs">RK</AvatarFallback>
        </Avatar>
      </button>
    </header>
  )
}

