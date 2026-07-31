import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import { cn } from "../../lib/utils"

const trendBadgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      trend: {
        up: "bg-success-light text-success-text",
        down: "bg-error-light text-error-text",
        neutral: "bg-bg-sunken text-text-muted",
      },
    },
    defaultVariants: {
      trend: "neutral",
    },
  }
)

export interface TrendBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof trendBadgeVariants> {
  value: number
}

export const TrendBadge: React.FC<TrendBadgeProps> = ({ className, trend, value, ...props }) => {
  const Icon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus

  return (
    <div className={cn(trendBadgeVariants({ trend }), className)} {...props}>
      <Icon className="w-3.5 h-3.5" />
      <span>{trend === "neutral" ? "—" : `${Math.abs(value)}%`}</span>
    </div>
  )
}
