'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api/client'
import { useOrgStore } from '@/stores/orgStore'
import { useAuthStore } from '@/stores/authStore'

export default function DangerZonePage() {
  const router = useRouter()
  const { activeOrg } = useOrgStore()
  const { logout } = useAuthStore()
  const [confirmText, setConfirmText] = useState('')

  const deleteOrgMutation = useMutation({
    mutationFn: () => apiFetch('DELETE', `/orgs/${activeOrg?.id}`),
    onSuccess: () => { logout(); router.push('/login') },
  })

  const canDelete = confirmText === activeOrg?.name

  return (
    <div>
      <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-error mb-1">Danger Zone</h3>
      <p className="text-on-surface-variant text-sm mb-8">
        These actions are irreversible. Please proceed with caution.
      </p>

      <div className="border-2 border-error/30 rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-error mt-0.5">warning</span>
          <div>
            <p className="font-semibold text-on-surface">Delete Organization</p>
            <p className="text-sm text-on-surface-variant mt-1">
              Permanently delete <strong>{activeOrg?.name}</strong> and all associated data including
              projects, datasets, dashboards, and reports. This cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs text-on-surface-variant">
            Type <strong className="text-on-surface">{activeOrg?.name}</strong> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={activeOrg?.name}
            className="glass-input px-4 py-2.5 rounded-lg text-sm max-w-xs"
          />
        </div>
        <button
          onClick={() => deleteOrgMutation.mutate()}
          disabled={!canDelete || deleteOrgMutation.isPending}
          className="bg-error text-on-error px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {deleteOrgMutation.isPending ? 'Deleting…' : 'Delete Organization'}
        </button>
      </div>
    </div>
  )
}
