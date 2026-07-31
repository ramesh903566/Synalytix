import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-brand text-text-inverse hover:bg-brand-hover shadow-level-1",
        secondary: "bg-bg-elevated border border-border text-text-primary hover:bg-bg-sunken shadow-level-1",
        ghost: "text-text-secondary hover:bg-bg-sunken hover:text-text-primary",
        danger: "bg-error text-text-inverse hover:bg-red-600 shadow-level-1",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm rounded-[var(--radius-button)]",
        sm: "h-8 px-3 text-xs rounded-[var(--radius-button)]",
        lg: "h-12 px-8 text-sm rounded-[var(--radius-button)]",
        icon: "h-10 w-10 rounded-[var(--radius-button)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
