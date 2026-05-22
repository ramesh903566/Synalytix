'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { apiFetch } from '@/lib/api/client'
import { useOrgStore } from '@/stores/orgStore'
import type { OrgMember, OrgRole } from '@/types/organization'
import { GlassInput } from '@/components/forms/GlassInput'

const InviteSchema = z.object({
  email: z.string().email(),
  role:  z.enum(['admin', 'manager', 'member', 'viewer']),
})
type InviteInput = z.infer<typeof InviteSchema>

const ROLE_COLORS: Record<OrgRole, string> = {
  owner:   'bg-primary/10 text-primary',
  admin:   'bg-tertiary/10 text-tertiary',
  manager: 'bg-secondary/10 text-secondary',
  member:  'bg-surface-container-high text-on-surface-variant',
  viewer:  'bg-surface-container text-on-surface-variant',
}

export default function TeamSettingsPage() {
  const { activeOrg } = useOrgStore()
  const qc = useQueryClient()
  const [showInviteForm, setShowInviteForm] = useState(false)

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['org-members', activeOrg?.id],
    queryFn: () => apiFetch<OrgMember[]>('GET', `/orgs/${activeOrg?.id}/members`),
    enabled: !!activeOrg?.id,
  })

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<InviteInput>({ resolver: zodResolver(InviteSchema), defaultValues: { role: 'member' } })

  const inviteMutation = useMutation({
    mutationFn: (data: InviteInput) =>
      apiFetch('POST', `/orgs/${activeOrg?.id}/invites`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['org-members', activeOrg?.id] })
      setShowInviteForm(false)
      reset()
    },
  })

  const removeMutation = useMutation({
    mutationFn: (userId: string) =>
      apiFetch('DELETE', `/orgs/${activeOrg?.id}/members/${userId}`),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['org-members', activeOrg?.id] }),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1">Team</h3>
          <p className="text-on-surface-variant text-sm">{members.length} member{members.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowInviteForm(true)}
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-full text-sm font-bold hover:bg-primary-container transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Invite Member
        </button>
      </div>

      {/* Invite form */}
      {showInviteForm && (
        <div className="glass-panel-bordered rounded-xl p-6 mb-6">
          <h4 className="font-semibold text-sm mb-4">Invite a new member</h4>
          <form onSubmit={handleSubmit((d) => inviteMutation.mutate(d))} className="flex gap-3 items-start">
            <div className="flex-1">
              <GlassInput
                {...register('email')}
                type="email"
                placeholder="colleague@company.com"
                icon="email"
                error={errors.email?.message}
              />
            </div>
            <select
              {...register('role')}
              className="glass-input px-4 py-3 rounded-full text-sm"
            >
              <option value="viewer">Viewer</option>
              <option value="member">Member</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={inviteMutation.isPending}
              className="bg-primary text-on-primary px-5 py-3 rounded-full text-sm font-bold hover:bg-primary-container transition-colors whitespace-nowrap"
            >
              {inviteMutation.isPending ? 'Sending…' : 'Send Invite'}
            </button>
            <button
              type="button"
              onClick={() => setShowInviteForm(false)}
              className="text-on-surface-variant hover:text-on-surface p-3"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </form>
        </div>
      )}

      {/* Member list */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-surface-container-high rounded-xl" />)}
        </div>
      ) : (
        <div className="glass-panel-bordered rounded-xl divide-y divide-outline-variant/30 overflow-hidden">
          {members.map((member) => (
            <div key={member.userId} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center font-bold text-sm text-on-primary">
                  {member.firstName[0]}{member.lastName[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-xs text-on-surface-variant">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${ROLE_COLORS[member.role]}`}>
                  {member.role}
                </span>
                {member.role !== 'owner' && (
                  <button
                    onClick={() => removeMutation.mutate(member.userId)}
                    className="text-on-surface-variant hover:text-error transition-colors p-1"
                    aria-label={`Remove ${member.firstName}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">person_remove</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
