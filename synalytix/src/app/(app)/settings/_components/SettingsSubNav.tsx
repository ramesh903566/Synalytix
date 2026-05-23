'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const SETTINGS_LINKS = [
  { href: '/settings/account',     label: 'Account',     icon: 'person'       },
  { href: '/settings/preferences', label: 'Preferences', icon: 'tune'         },
  { href: '/settings/team',        label: 'Team',        icon: 'group'        },
  { href: '/settings/api-keys',    label: 'API Keys',    icon: 'key'          },
] as const

export function SettingsSubNav() {
  const pathname = usePathname()

  return (
    <nav className="w-full md:w-64 flex-shrink-0">
      <ul className="flex flex-col space-y-1">
        {SETTINGS_LINKS.map(({ href, label, icon }) => {
          const isActive = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-r-lg border-l-4 transition-colors',
                  isActive
                    ? 'bg-surface-variant/80 border-primary text-primary font-bold'
                    : 'border-transparent text-on-surface-variant hover:bg-surface-variant/50'
                )}
              >
                <span>{label}</span>
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
              </Link>
            </li>
          )
        })}
        <li className="mt-4 border-t border-outline-variant/30 pt-4">
          <Link
            href="/settings/danger"
            className={cn(
              'flex items-center justify-between px-4 py-3 rounded-r-lg border-l-4 transition-colors',
              pathname === '/settings/danger'
                ? 'bg-error-container/80 border-error text-error font-bold'
                : 'border-transparent text-error hover:bg-error-container/50'
            )}
          >
            <span>Danger Zone</span>
            <span className="material-symbols-outlined text-[18px]">warning</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
