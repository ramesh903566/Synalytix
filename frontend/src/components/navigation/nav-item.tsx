import * as React from "react"
import { NavLink } from "react-router-dom"
import { cn } from "../../lib/utils"
import { Tooltip } from "../ui/tooltip"
import type { LucideIcon } from "lucide-react"

export interface NavItemProps {
  label: string
  path: string
  icon: LucideIcon
  end?: boolean
  collapsed?: boolean
}

export function NavItem({ label, path, icon: Icon, end, collapsed }: NavItemProps) {
  const link = (
    <NavLink
      to={path}
      end={end}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-card-inner)] text-sm font-medium transition-all duration-150",
          collapsed && "justify-center px-0 w-10 h-10 mx-auto",
          isActive
            ? "bg-brand-light text-brand"
            : "text-text-secondary hover:text-text-primary hover:bg-bg-sidebar-hover"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && !collapsed && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand rounded-r-full" />
          )}
          <Icon className={cn("w-[18px] h-[18px] shrink-0", isActive ? "text-brand" : "text-text-muted group-hover:text-text-secondary")} />
          {!collapsed && <span>{label}</span>}
        </>
      )}
    </NavLink>
  )

  if (collapsed) {
    return <Tooltip content={label} side="right">{link}</Tooltip>
  }

  return link
}
