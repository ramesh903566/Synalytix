import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "../../lib/utils"
import { Search, ArrowUp, ArrowDown, CornerDownLeft, X } from "lucide-react"
import { APP_REGISTRY } from "../../lib/appRegistry"
import { useChatStore } from "../../store/chatStore"

interface SearchResult {
  id: string
  title: string
  subtitle?: string
  section: string
  icon?: string
  action: () => void
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate()
  const toggleChat = useChatStore((s) => s.togglePanel)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const allResults = useMemo<SearchResult[]>(() => {
    const pages: SearchResult[] = [
      { id: "dashboard", title: "Dashboard", subtitle: "Overview & stats", section: "Pages", action: () => navigate("/app") },
      { id: "studio", title: "Studio", subtitle: "Create & publish content", section: "Pages", action: () => navigate("/app/studio") },
      { id: "apps", title: "Connected Apps", subtitle: "Manage platforms", section: "Pages", action: () => navigate("/app/apps") },
      { id: "analytics", title: "Analytics Hub", subtitle: "Cross-platform insights", section: "Pages", action: () => navigate("/app/analytics") },
      { id: "recommendations", title: "AI Recommendations", subtitle: "Career & growth tips", section: "Pages", action: () => navigate("/app/recommendations") },
      { id: "planner", title: "Planner", subtitle: "Schedule & tasks", section: "Pages", action: () => navigate("/app/planner") },
      { id: "settings", title: "Settings", subtitle: "Account & preferences", section: "Pages", action: () => navigate("/app/settings") },
    ]

    const apps: SearchResult[] = APP_REGISTRY.map((app) => ({
      id: `app-${app.id}`,
      title: app.name,
      subtitle: `View ${app.name} analytics`,
      section: "Platforms",
      icon: app.iconUrl,
      action: () => navigate(`/app/apps/${app.id}`),
    }))

    const settings: SearchResult[] = [
      { id: "settings-account", title: "Account Settings", section: "Settings", action: () => navigate("/app/settings?tab=account") },
      { id: "settings-ai", title: "AI Providers", subtitle: "Configure API keys", section: "Settings", action: () => navigate("/app/settings?tab=ai-providers") },
      { id: "settings-integrations", title: "Integrations", subtitle: "Connected services", section: "Settings", action: () => navigate("/app/settings?tab=integrations") },
      { id: "settings-calendars", title: "Calendars", subtitle: "Calendar sync", section: "Settings", action: () => navigate("/app/settings?tab=calendars") },
    ]

    const actions: SearchResult[] = [
      { id: "action-chat", title: "Open AI Chat", subtitle: "Ask anything", section: "Actions", action: () => { onClose(); toggleChat() } },
    ]

    return [...actions, ...pages, ...apps, ...settings]
  }, [navigate, onClose, toggleChat])

  const filtered = useMemo(() => {
    if (!query.trim()) return allResults
    const q = query.toLowerCase()
    return allResults.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle?.toLowerCase().includes(q) ||
        r.section.toLowerCase().includes(q)
    )
  }, [query, allResults])

  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {}
    for (const r of filtered) {
      if (!groups[r.section]) groups[r.section] = []
      groups[r.section].push(r)
    }
    return groups
  }, [filtered])

  const flatList = useMemo(() => filtered, [filtered])

  useEffect(() => {
    if (open) {
      setQuery("")
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const item = listRef.current?.children[selectedIndex] as HTMLElement
    item?.scrollIntoView({ block: "nearest" })
  }, [selectedIndex])

  const execute = useCallback(
    (result: SearchResult) => {
      result.action()
      onClose()
    },
    [onClose]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, flatList.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === "Enter" && flatList[selectedIndex]) {
        e.preventDefault()
        execute(flatList[selectedIndex])
      } else if (e.key === "Escape") {
        onClose()
      }
    },
    [flatList, selectedIndex, execute, onClose]
  )

  if (!open) return null

  let runningIndex = -1

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onKeyDown={handleKeyDown}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm" onClick={onClose} />

      {/* Palette */}
      <div className="relative w-full max-w-lg mx-4 bg-bg-elevated rounded-[var(--radius-card)] border border-border shadow-level-3 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search className="w-4 h-4 text-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, apps, settings..."
            className="flex-1 h-12 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-1 rounded hover:bg-bg-sunken transition-colors">
              <X className="w-3.5 h-3.5 text-text-muted" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-[var(--radius-badge)] bg-bg-sunken border border-border px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
          {flatList.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-text-muted">No results found for "{query}"</div>
          ) : (
            Object.entries(grouped).map(([section, items]) => (
              <div key={section}>
                <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">{section}</div>
                {items.map((result) => {
                  runningIndex++
                  const idx = runningIndex
                  const isSelected = idx === selectedIndex
                  return (
                    <button
                      key={result.id}
                      onClick={() => execute(result)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                        isSelected ? "bg-brand-light" : "hover:bg-bg-sunken"
                      )}
                    >
                      {result.icon ? (
                        <img src={result.icon} alt="" className="w-5 h-5 rounded-md object-cover shrink-0" />
                      ) : (
                        <div className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[10px] font-bold",
                          isSelected ? "bg-brand text-white" : "bg-bg-sunken text-text-muted"
                        )}>
                          {result.title.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={cn("text-sm font-medium truncate", isSelected ? "text-brand" : "text-text-primary")}>
                          {result.title}
                        </div>
                        {result.subtitle && (
                          <div className="text-xs text-text-muted truncate">{result.subtitle}</div>
                        )}
                      </div>
                      {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-brand shrink-0" />}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[10px] text-text-muted">
          <span className="flex items-center gap-1"><ArrowUp className="w-3 h-3" /><ArrowDown className="w-3 h-3" /> navigate</span>
          <span className="flex items-center gap-1"><CornerDownLeft className="w-3 h-3" /> select</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-bg-sunken border border-border rounded text-[9px]">ESC</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
