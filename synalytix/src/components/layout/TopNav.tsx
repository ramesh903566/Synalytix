'use client'

import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CommandPalette } from '@/components/shared/CommandPalette'

interface TopNavProps {
  title: string
}

export function TopNav({ title }: TopNavProps) {
  const { user } = useAuthStore()
  const { openCommandPalette } = useUIStore()

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '??'

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface/50 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between px-6 w-full">
      <h2 className="font-headline-lg text-headline-lg text-on-surface">{title}</h2>

      <div className="flex items-center gap-4">
        {/* Cmd+K search trigger */}
        <button
          onClick={openCommandPalette}
          className="hidden md:flex items-center gap-2 text-on-surface-variant text-sm px-3 py-1.5 rounded-full border border-outline-variant/50 hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">search</span>
          <span>Search</span>
          <kbd className="text-xs bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/50 ml-2">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          className="relative text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-variant/50 transition-colors"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
          {/* Unread badge */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Avatar */}
        <Avatar className="w-8 h-8 border-2 border-primary cursor-pointer">
          <AvatarImage src={user?.avatarUrl ?? undefined} alt={`${user?.firstName} ${user?.lastName}`} />
          <AvatarFallback className="bg-primary text-on-primary text-xs font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
      <CommandPalette />
    </header>
  )
}
