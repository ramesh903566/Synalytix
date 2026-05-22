'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api/client'
import { cn } from '@/lib/utils'

interface UserPreferences {
  theme:              'light' | 'dark' | 'system'
  emailDigest:        'daily' | 'weekly' | 'never'
  notifyOnAnomalies:  boolean
  notifyOnReports:    boolean
  defaultDateRange:   '7d' | '30d' | '90d'
}

const THEME_OPTIONS = [
  { value: 'light',  label: 'Light',  icon: 'light_mode'  },
  { value: 'dark',   label: 'Dark',   icon: 'dark_mode'   },
  { value: 'system', label: 'System', icon: 'display_settings' },
] as const

export default function PreferencesPage() {
  const qc = useQueryClient()

  const { data: prefs, isLoading } = useQuery({
    queryKey: ['preferences'],
    queryFn: () => apiFetch<UserPreferences>('GET', '/users/me/preferences'),
  })

  const updateMutation = useMutation({
    mutationFn: (patch: Partial<UserPreferences>) =>
      apiFetch<UserPreferences>('PATCH', '/users/me/preferences', patch),
    onSuccess: (updated) => {
      qc.setQueryData(['preferences'], updated)
    },
  })

  const toggle = (key: keyof UserPreferences, value: unknown) =>
    prefs && updateMutation.mutate({ [key]: value })

  if (isLoading) return <div className="animate-pulse space-y-6">
    {[1,2,3].map(i => <div key={i} className="h-24 bg-surface-container-high rounded-xl" />)}
  </div>

  return (
    <div>
      <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1">Preferences</h3>
      <p className="text-on-surface-variant text-sm mb-8">Customize your Synalytix experience.</p>

      <div className="space-y-6">
        {/* Theme */}
        <section className="glass-panel-bordered rounded-xl p-6">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-on-surface-variant mb-4">Appearance</h4>
          <div className="grid grid-cols-3 gap-3">
            {THEME_OPTIONS.map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => toggle('theme', value)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm',
                  prefs?.theme === value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant text-on-surface-variant hover:border-primary/50'
                )}
              >
                <span className="material-symbols-outlined text-[24px]">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="glass-panel-bordered rounded-xl p-6">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-on-surface-variant mb-4">Notifications</h4>
          <div className="space-y-4">
            {[
              { key: 'notifyOnAnomalies' as const, label: 'Anomaly detection alerts', desc: 'Get notified when AI detects unusual patterns' },
              { key: 'notifyOnReports'   as const, label: 'Report generation',         desc: 'Notify when scheduled reports are ready' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-on-surface">{label}</p>
                  <p className="text-xs text-on-surface-variant">{desc}</p>
                </div>
                <button
                  onClick={() => toggle(key, !prefs?.[key])}
                  className={cn(
                    'w-11 h-6 rounded-full transition-colors relative',
                    prefs?.[key] ? 'bg-primary' : 'bg-surface-container-highest'
                  )}
                  role="switch"
                  aria-checked={prefs?.[key]}
                >
                  <span className={cn(
                    'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                    prefs?.[key] ? 'translate-x-5' : 'translate-x-0.5'
                  )} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Email digest */}
        <section className="glass-panel-bordered rounded-xl p-6">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-on-surface-variant mb-4">Email Digest</h4>
          <div className="flex gap-3">
            {(['daily', 'weekly', 'never'] as const).map((v) => (
              <button
                key={v}
                onClick={() => toggle('emailDigest', v)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium capitalize border transition-all',
                  prefs?.emailDigest === v
                    ? 'bg-primary text-on-primary border-primary'
                    : 'border-outline-variant text-on-surface-variant hover:border-primary/50'
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
