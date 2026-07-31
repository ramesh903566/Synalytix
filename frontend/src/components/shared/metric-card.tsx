import * as React from "react"
import { Card, CardContent } from "../ui/card"
import { cn } from "../../lib/utils"

export interface MetricCardProps {
  title: string
  value: string | number
  trend?: {
    value: number
    label: string
  }
  icon?: React.ReactNode
  className?: string
}

export function MetricCard({ title, value, trend, icon, className }: MetricCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-zinc-500">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold tracking-tight text-zinc-900">{value}</h3>
              {trend && (
                <span className={cn(
                  "text-xs font-medium",
                  trend.value > 0 ? "text-emerald-600" : trend.value < 0 ? "text-rose-600" : "text-zinc-500"
                )}>
                  {trend.value > 0 ? "+" : ""}{trend.value}% {trend.label}
                </span>
              )}
            </div>
          </div>
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-100 text-zinc-600">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
