import * as React from "react"
import { cn } from "../../lib/utils"

export interface ChartCardProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  minHeight?: number
}

export function ChartCard({ title, subtitle, action, children, className, minHeight = 200 }: ChartCardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-border bg-bg-elevated p-6 shadow-level-1 flex flex-col",
        className
      )}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
      <div className="flex-1 w-full" style={{ minHeight }}>
        {children}
      </div>
    </div>
  )
}
