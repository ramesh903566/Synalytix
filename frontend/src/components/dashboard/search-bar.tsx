import * as React from "react"
import { cn } from "../../lib/utils"
import { Search } from "lucide-react"

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ value, onChange, onKeyDown, placeholder = "Search anything…", className }: SearchBarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  return (
    <div className={cn("relative flex items-center", className)}>
      <Search className="absolute left-3 w-4 h-4 text-text-muted pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-12 rounded-[var(--radius-input)] border border-border bg-bg-sunken text-sm text-text-primary placeholder:text-text-muted transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-bg-elevated"
      />
      <kbd className="absolute right-3 hidden sm:inline-flex items-center gap-0.5 rounded-[var(--radius-badge)] bg-bg-elevated border border-border px-1.5 py-0.5 text-[10px] font-medium text-text-muted shadow-sm">
        ⌘K
      </kbd>
    </div>
  )
}

