import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Organization } from '@/types/organization'

interface OrgState {
  activeOrg:    Organization | null
  orgs:         Organization[]
  setActiveOrg: (org: Organization) => void
  setOrgs:      (orgs: Organization[]) => void
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      activeOrg: null,
      orgs:      [],
      setActiveOrg: (org)  => set({ activeOrg: org }),
      setOrgs:      (orgs) => set({ orgs }),
    }),
    { name: 'synalytix-org', partialize: (s) => ({ activeOrg: s.activeOrg }) }
  )
)
