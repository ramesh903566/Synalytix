export type OrgRole = 'owner' | 'admin' | 'manager' | 'member' | 'viewer'

export interface Organization {
  id:                 string
  name:               string
  slug:               string
  planTier:           'free' | 'pro' | 'business' | 'enterprise'
  subscriptionStatus: 'active' | 'trialing' | 'past_due' | 'canceled'
  logoUrl:            string | null
  createdAt:          string
}

export interface OrgMember {
  userId:    string
  firstName: string
  lastName:  string
  email:     string
  avatarUrl: string | null
  role:      OrgRole
  joinedAt:  string
}
