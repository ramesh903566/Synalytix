import * as React from "react"
import { cn } from "../../lib/utils"

export interface ChartCardProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
  minHeight?: number
  children: React.ReactNode
}

export function ChartCard({ title, subtitle, action, className, minHeight = 200, children }: ChartCardProps) {
  return (
    <div className={cn("rounded-[var(--radius-card)] border border-border bg-bg-elevated p-5", className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div style={{ minHeight }} className="w-full">
        {children}
      </div>
    </div>
  )
}
