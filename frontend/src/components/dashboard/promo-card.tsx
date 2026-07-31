import * as React from "react"
import { cn } from "../../lib/utils"
import { Zap, ArrowRight } from "lucide-react"

export interface PromoCardProps {
  headline: string
  description: string
  ctaLabel?: string
  onCtaClick?: () => void
  icon?: React.ReactNode
  variant?: "brand" | "dark"
  className?: string
}

export function PromoCard({
  headline,
  description,
  ctaLabel = "Learn More",
  onCtaClick,
  icon,
  variant = "dark",
  className,
}: PromoCardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] p-6 flex items-start gap-4 transition-all duration-150",
        variant === "dark" && "bg-text-primary text-text-inverse",
        variant === "brand" && "bg-gradient-to-br from-brand to-chart-3 text-text-inverse",
        className
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-[var(--radius-card-inner)] flex items-center justify-center shrink-0",
        variant === "dark" && "bg-white/10",
        variant === "brand" && "bg-white/20",
      )}>
        {icon || <Zap className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold mb-1">{headline}</h4>
        <p className="text-xs leading-relaxed opacity-80">{description}</p>
      </div>
      {onCtaClick && (
        <button
          onClick={onCtaClick}
          className={cn(
            "shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-button)] transition-all",
            variant === "dark" && "bg-white/10 hover:bg-white/20 text-text-primary",
            variant === "brand" && "bg-white/20 hover:bg-white/30 text-text-primary",
          )}
        >
          {ctaLabel}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
