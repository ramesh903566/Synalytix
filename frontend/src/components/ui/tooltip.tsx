import * as React from "react"
import { cn } from "../../lib/utils"

export interface TooltipProps {
  content: string
  side?: "top" | "bottom" | "left" | "right"
  children: React.ReactNode
  className?: string
}

export function Tooltip({ content, side = "top", children, className }: TooltipProps) {
  const [visible, setVisible] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const show = () => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setVisible(true), 400)
  }

  const hide = () => {
    clearTimeout(timeoutRef.current)
    setVisible(false)
  }

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {visible && (
        <div
          className={cn(
            "absolute z-50 px-2 py-1 text-xs font-medium text-text-inverse bg-text-primary rounded-[var(--radius-badge)] whitespace-nowrap pointer-events-none",
            positionClasses[side],
            className
          )}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  )
}
