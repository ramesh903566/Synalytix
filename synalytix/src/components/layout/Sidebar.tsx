'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', icon: 'dashboard',     label: 'Dashboard' },
  { href: '/apps',      icon: 'apps',           label: 'Apps'      },
  { href: '/studio',    icon: 'auto_awesome',   label: 'Studio'    },
  { href: '/analytics', icon: 'bar_chart',      label: 'Analytics' },
  { href: '/insights',  icon: 'psychology',     label: 'Insights'  },
  { href: '/settings',  icon: 'settings',       label: 'Settings'  },
] as const

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { logout } = useAuthStore()

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex flex-col',
        'bg-white/70 backdrop-blur-xl border-r border-white/20 shadow-sm',
        'transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={toggleSidebar}
            className="text-primary"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="material-symbols-outlined text-3xl select-none">bolt</span>
          </button>
          {!sidebarCollapsed && (
            <div>
              <h1 className="font-headline-lg text-[20px] leading-none text-on-surface tracking-widest">
                Synalytix
              </h1>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                AI Command Center
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'rounded-lg mx-2 my-0.5 flex items-center gap-3 px-3 py-2',
                  'transition-all duration-150',
                  isActive
                    ? 'bg-primary text-on-primary scale-95'
                    : 'text-on-surface-variant hover:bg-surface-container-highest'
                )}
                title={sidebarCollapsed ? label : undefined}
              >
                <span
                  className="material-symbols-outlined text-[20px] flex-shrink-0 select-none"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {icon}
                </span>
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium truncate">{label}</span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom: Upgrade + Help + Logout */}
      <div className="mt-auto p-6 flex flex-col gap-4">
        {!sidebarCollapsed && (
          <button className="bg-primary text-on-primary w-full py-3 rounded-lg font-headline-lg-mobile text-headline-lg-mobile hover:bg-primary-container transition-colors text-sm">
            Upgrade to Pro
          </button>
        )}
        <nav className="flex flex-col gap-1">
          {[
            { href: '/help',   icon: 'help',   label: 'Help'   },
          ].map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              className="text-on-surface-variant hover:bg-surface-container-highest rounded-lg mx-2 my-0.5 flex items-center gap-3 px-3 py-2 transition-colors"
              title={sidebarCollapsed ? label : undefined}
            >
              <span className="material-symbols-outlined text-[20px] select-none">{icon}</span>
              {!sidebarCollapsed && <span className="text-sm">{label}</span>}
            </Link>
          ))}
          <button
            onClick={logout}
            className="text-on-surface-variant hover:bg-surface-container-highest rounded-lg mx-2 my-0.5 flex items-center gap-3 px-3 py-2 transition-colors w-full text-left"
            title={sidebarCollapsed ? 'Logout' : undefined}
          >
            <span className="material-symbols-outlined text-[20px] select-none">logout</span>
            {!sidebarCollapsed && <span className="text-sm">Logout</span>}
          </button>
        </nav>
      </div>
    </aside>
  )
}
