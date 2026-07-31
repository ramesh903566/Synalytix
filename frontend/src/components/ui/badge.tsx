import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius-badge)] border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-bg-sunken text-text-primary",
        primary: "border-transparent bg-brand-light text-brand",
        success: "border-success/20 bg-success-light text-success-text",
        warning: "border-warning/20 bg-warning-light text-warning-text",
        danger: "border-transparent bg-error-light text-error-text",
        info: "border-info/20 bg-info-light text-info-text",
        outline: "text-text-primary border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
