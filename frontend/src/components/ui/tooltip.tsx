import * as React from "react"
import { cn } from "../../lib/utils"

export interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

export function Tooltip({ content, children, side = "right", className }: TooltipProps) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
  }

  return (
    <div className="relative group/tooltip">
      {children}
      <div
        role="tooltip"
        className={cn(
          "absolute z-50 hidden group-hover/tooltip:block whitespace-nowrap rounded-[var(--radius-tooltip)] bg-text-primary px-2.5 py-1.5 text-xs font-medium text-text-inverse shadow-level-2 pointer-events-none",
          positionClasses[side],
          className
        )}
      >
        {content}
      </div>
    </div>
  )
}
