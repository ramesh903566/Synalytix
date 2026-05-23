'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

const COMMANDS = [
  { label: 'Go to Dashboard',   icon: 'dashboard',   href: '/dashboard'          },
  { label: 'Go to Apps',        icon: 'apps',        href: '/apps'               },
  { label: 'Go to Studio',      icon: 'auto_awesome',href: '/studio'             },
  { label: 'Go to Analytics',   icon: 'bar_chart',   href: '/analytics'          },
  { label: 'Go to Insights',    icon: 'psychology',  href: '/insights'           },
  { label: 'Account Settings',  icon: 'person',      href: '/settings/account'   },
  { label: 'Preferences',       icon: 'tune',        href: '/settings/preferences'},
  { label: 'Manage Team',       icon: 'group',       href: '/settings/team'      },
  { label: 'API Keys',          icon: 'key',         href: '/settings/api-keys'  },
]

export function CommandPalette() {
  const router = useRouter()
  const { commandPaletteOpen, closeCommandPalette } = useUIStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        useUIStore.getState().openCommandPalette()
      }
      if (e.key === 'Escape') closeCommandPalette()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeCommandPalette])

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
    }
  }, [commandPaletteOpen])

  if (!commandPaletteOpen) return null

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-on-surface/20 backdrop-blur-sm"
      onClick={closeCommandPalette}
    >
      <div
        className="glass-panel rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant/30">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or jump to…"
            className="flex-1 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant text-sm"
          />
          <kbd className="text-xs bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/50">ESC</kbd>
        </div>
        <ul className="py-2 max-h-72 overflow-y-auto">
          {filtered.length === 0 ? (
            <li className="px-5 py-8 text-center text-on-surface-variant text-sm">No results found</li>
          ) : (
            filtered.map((cmd) => (
              <li key={cmd.href}>
                <button
                  onClick={() => { router.push(cmd.href); closeCommandPalette() }}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-surface-container transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">{cmd.icon}</span>
                  <span className="text-sm text-on-surface">{cmd.label}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
