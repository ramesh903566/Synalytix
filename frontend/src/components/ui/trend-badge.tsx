import { cn } from "../../lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export interface TrendBadgeProps {
  trend: "up" | "down" | "neutral"
  value: number
  className?: string
}

export function TrendBadge({ trend, value, className }: TrendBadgeProps) {
  const config = {
    up: { icon: TrendingUp, color: "text-green-600 bg-green-50" },
    down: { icon: TrendingDown, color: "text-red-600 bg-red-50" },
    neutral: { icon: Minus, color: "text-text-muted bg-bg-elevated" },
  }[trend]

  const Icon = config.icon

  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold", config.color, className)}>
      <Icon className="w-3 h-3" />
      {Math.abs(value)}%
    </span>
  )
}
