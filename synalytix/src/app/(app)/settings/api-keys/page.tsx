'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { apiFetch } from '@/lib/api/client'
import { useOrgStore } from '@/stores/orgStore'

interface ApiKey {
  id:          string
  name:        string
  prefix:      string     // e.g. "syx_live_abc..."
  permissions: string[]
  lastUsedAt:  string | null
  createdAt:   string
}

interface CreatedApiKey extends ApiKey {
  secret: string   // only returned once at creation
}

export default function ApiKeysPage() {
  const { activeOrg } = useOrgStore()
  const qc = useQueryClient()
  const [newKey, setNewKey] = useState<CreatedApiKey | null>(null)
  const [newKeyName, setNewKeyName] = useState('')
  const [copied, setCopied] = useState(false)

  const { data: keys = [], isLoading } = useQuery({
    queryKey: ['api-keys', activeOrg?.id],
    queryFn: () => apiFetch<ApiKey[]>('GET', `/orgs/${activeOrg?.id}/api-keys`),
    enabled: !!activeOrg?.id,
  })

  const createMutation = useMutation({
    mutationFn: (name: string) =>
      apiFetch<CreatedApiKey>('POST', `/orgs/${activeOrg?.id}/api-keys`, { name }),
    onSuccess: (key) => {
      setNewKey(key)
      setNewKeyName('')
      qc.invalidateQueries({ queryKey: ['api-keys', activeOrg?.id] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (keyId: string) =>
      apiFetch('DELETE', `/orgs/${activeOrg?.id}/api-keys/${keyId}`),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['api-keys', activeOrg?.id] }),
  })

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1">API Keys</h3>
      <p className="text-on-surface-variant text-sm mb-8">
        Use API keys to authenticate requests from your applications.
        Keys are scoped to your organization and follow your RBAC permissions.
      </p>

      {/* New key revealed */}
      {newKey && (
        <div className="bg-secondary-container border border-secondary/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3 mb-3">
            <span className="material-symbols-outlined text-secondary">check_circle</span>
            <div>
              <p className="font-semibold text-sm text-on-surface">API key created: <strong>{newKey.name}</strong></p>
              <p className="text-xs text-on-surface-variant mt-0.5">Copy this key now — it won't be shown again.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-surface-container-lowest rounded-lg px-4 py-3">
            <code className="flex-1 text-xs font-mono text-on-surface break-all">{newKey.secret}</code>
            <button
              onClick={() => copyToClipboard(newKey.secret)}
              className="text-primary hover:text-primary-container flex-shrink-0"
              aria-label="Copy API key"
            >
              <span className="material-symbols-outlined text-[20px]">
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>
          <button
            onClick={() => setNewKey(null)}
            className="text-xs text-on-surface-variant hover:underline mt-3"
          >
            I've saved my key, dismiss this
          </button>
        </div>
      )}

      {/* Create new key */}
      <div className="glass-panel-bordered rounded-xl p-6 mb-6">
        <h4 className="font-semibold text-sm mb-4">Create New Key</h4>
        <div className="flex gap-3">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="e.g. Production App"
            className="glass-input flex-1 px-4 py-2.5 rounded-full text-sm"
          />
          <button
            onClick={() => newKeyName.trim() && createMutation.mutate(newKeyName.trim())}
            disabled={!newKeyName.trim() || createMutation.isPending}
            className="bg-primary text-on-primary px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating…' : 'Create Key'}
          </button>
        </div>
      </div>

      {/* Existing keys */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1,2].map(i => <div key={i} className="h-16 bg-surface-container-high rounded-xl" />)}
        </div>
      ) : keys.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl block mb-3 opacity-30">key</span>
          <p className="text-sm">No API keys yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="glass-panel-bordered rounded-xl divide-y divide-outline-variant/30 overflow-hidden">
          {keys.map((key) => (
            <div key={key.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-on-surface">{key.name}</p>
                <p className="text-xs font-mono text-on-surface-variant mt-0.5">{key.prefix}••••••••</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-xs text-on-surface-variant">
                  {key.lastUsedAt
                    ? `Last used ${new Date(key.lastUsedAt).toLocaleDateString()}`
                    : 'Never used'}
                </p>
                <button
                  onClick={() => deleteMutation.mutate(key.id)}
                  className="text-on-surface-variant hover:text-error transition-colors p-1"
                  aria-label={`Delete ${key.name}`}
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
