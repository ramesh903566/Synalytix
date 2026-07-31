import * as React from "react"
import { cn } from "../../lib/utils"
import { TrendBadge } from "../ui/trend-badge"
import { formatNumber } from "../../lib/theme"
import type { LucideIcon } from "lucide-react"

export interface StatCardProps {
  label: string
  value: number | string
  trend?: { value: number; direction: "up" | "down" | "neutral" }
  icon?: LucideIcon
  className?: string
  onClick?: () => void
}

export function StatCard({ label, value, trend, icon: Icon, className, onClick }: StatCardProps) {
  const displayValue = typeof value === "number" ? formatNumber(value) : value

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => { if (onClick && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onClick(); } }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "rounded-[var(--radius-card)] border border-border bg-bg-elevated p-5 flex flex-col justify-between min-h-[140px] transition-all duration-150",
        "hover:shadow-level-2 hover:border-border-strong",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        {Icon && (
          <div className="w-9 h-9 rounded-[var(--radius-card-inner)] bg-brand-light flex items-center justify-center">
            <Icon className="w-4 h-4 text-brand" />
          </div>
        )}
        {trend && (
          <TrendBadge trend={trend.direction} value={trend.value} />
        )}
      </div>
      <div className="mt-auto">
        <p className="text-[32px] font-bold leading-tight tracking-tight text-text-primary">{displayValue}</p>
        <p className="text-xs font-medium text-text-muted mt-1 tracking-wide">{label}</p>
      </div>
    </div>
  )
}
