import * as React from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "../../lib/utils"
import { NavItem } from "./nav-item"
import { Avatar, AvatarFallback } from "../ui/avatar"
import {
  LayoutDashboard, Wand2, Grid3X3, BarChart3, Settings,
  Sparkles, CalendarCheck, PanelLeftClose, PanelLeftOpen, LogOut,
} from "lucide-react"
import { useAppContext } from "../../context/AppContext"

export interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { label: "Dashboard", path: "/app", icon: LayoutDashboard, end: true },
  { label: "Studio", path: "/app/studio", icon: Wand2 },
  { label: "Apps", path: "/app/apps", icon: Grid3X3 },
  { label: "Analytics", path: "/app/analytics", icon: BarChart3 },
  { label: "AI Recs", path: "/app/recommendations", icon: Sparkles },
  { label: "Planner", path: "/app/planner", icon: CalendarCheck },
  { label: "Settings", path: "/app/settings", icon: Settings },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { logout } = useAppContext()
  const navigate = useNavigate()

  return (
    <aside
      className={cn(
        "flex flex-col bg-bg-sidebar border-r border-border h-full transition-all duration-200 shrink-0",
        collapsed ? "w-[var(--sidebar-collapsed)]" : "w-[var(--sidebar-width)]"
      )}
    >
      {/* Logo + Profile */}
      <div className={cn("p-5", collapsed && "p-3")}>
        {/* Logo */}
        <div className={cn("flex items-center gap-2.5 mb-6", collapsed && "justify-center mb-4")}>
          <div className="w-8 h-8 bg-brand rounded-[var(--radius-card-inner)] flex items-center justify-center shrink-0">
            <span className="text-text-inverse font-bold text-xs">S</span>
          </div>
          {!collapsed && <h1 className="text-base font-semibold tracking-tight text-text-primary">Synalytix</h1>}
        </div>

      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 px-3 space-y-1 overflow-y-auto", collapsed && "px-2")}>
        {!collapsed ? (
          <div className="flex items-center justify-between mb-3 px-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Navigation</p>
            <button
              onClick={onToggle}
              className="text-text-muted hover:text-text-secondary transition-colors flex items-center justify-center p-1 rounded hover:bg-bg-sidebar-hover"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center mb-3">
            <button
              onClick={onToggle}
              className="text-text-muted hover:text-text-secondary transition-colors flex items-center justify-center p-2 rounded hover:bg-bg-sidebar-hover"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}
        {navItems.map((item) => (
          <NavItem key={item.path} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className={cn("p-3 border-t border-border-light space-y-1", collapsed && "p-2")}>

        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius-card-inner)] text-xs font-medium text-text-muted hover:text-error-text hover:bg-error-light transition-colors",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  )
}
