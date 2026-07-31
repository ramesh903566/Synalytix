import * as React from "react"
import { cn } from "../../lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangle" | "circle" | "text"
  width?: string | number
  height?: string | number
}

export function Skeleton({ className, variant = "rectangle", width, height, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-bg-sunken",
        variant === "circle" && "rounded-[var(--radius-avatar)]",
        variant === "rectangle" && "rounded-[var(--radius-card-inner)]",
        variant === "text" && "rounded-[var(--radius-badge)] h-4",
        className
      )}
      style={{ width, height }}
      {...props}
    />
  )
}

/** Pre-composed card skeleton with header, body, chart area */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[var(--radius-card)] border border-border bg-bg-elevated p-6 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="w-24 h-4" />
        <Skeleton variant="text" className="w-16 h-4" />
      </div>
      <Skeleton className="w-20 h-8" />
      <Skeleton className="w-full h-32" />
    </div>
  )
}

/** Pre-composed stat card skeleton */
export function StatSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[var(--radius-card)] border border-border bg-bg-elevated p-5 space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Skeleton variant="circle" className="w-8 h-8" />
        <Skeleton variant="text" className="w-14 h-5" />
      </div>
      <Skeleton className="w-24 h-8" />
      <Skeleton variant="text" className="w-32 h-3" />
    </div>
  )
}
