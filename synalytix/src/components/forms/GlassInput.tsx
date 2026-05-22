import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string     // Material Symbol name
  error?: string
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ icon, error, className, ...props }, ref) => (
    <div className="relative">
      {icon && (
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-[20px] pointer-events-none select-none">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'glass-input w-full py-3 rounded-full text-sm transition-all duration-150',
          icon ? 'pl-12 pr-4' : 'px-4',
          error && 'border-error focus:border-error focus:shadow-[0_0_0_2px_rgba(186,26,26,0.2)]',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-error text-xs mt-1 ml-4">{error}</p>
      )}
    </div>
  )
)
GlassInput.displayName = 'GlassInput'
