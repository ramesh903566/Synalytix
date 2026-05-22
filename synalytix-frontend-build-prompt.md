# Synalytix — Master Frontend Build Prompt
> **Version:** 1.0 | **Stack:** Next.js 14 App Router · TypeScript Strict · Tailwind CSS · shadcn/ui · TanStack Query · Zustand  
> **Source design:** Stitch HTML prototypes (Register page + Settings shell)  
> **Target:** Production-grade SaaS frontend that integrates seamlessly with the Synalytix backend API

---

## 0. How to Use This Document

This is a **sequential build prompt**. Work through each section in order. Every section contains:
- Architecture decisions and reasoning
- Exact file paths and folder structure
- Complete TypeScript types and Zod schemas
- Component implementation with all states (loading, empty, error)
- API integration contract (endpoint + request/response shape)
- Tailwind class conventions extracted from the Stitch prototypes

Feed each section to your AI coding assistant (or developer) as a self-contained unit. Do NOT skip sections — each builds on the last.

---

## 1. Design System Extraction (from Stitch Prototypes)

### 1.1 Token Map

Extract these exact values from the Stitch HTML and wire them into `tailwind.config.ts` and `src/styles/globals.css`:

```ts
// tailwind.config.ts — colors (Material You palette)
colors: {
  primary:                  "#3e32d3",
  "primary-container":      "#5850ec",
  "on-primary":             "#ffffff",
  "on-primary-container":   "#e9e5ff",
  "primary-fixed":          "#e2dfff",
  "primary-fixed-dim":      "#c3c0ff",
  "inverse-primary":        "#c3c0ff",

  secondary:                "#276954",
  "secondary-container":    "#abeed2",
  "on-secondary":           "#ffffff",
  "on-secondary-container": "#2c6e58",

  tertiary:                 "#4b4b7e",
  "tertiary-container":     "#636398",
  "on-tertiary":            "#ffffff",
  "on-tertiary-container":  "#e8e5ff",

  surface:                  "#f7f9fb",
  "surface-dim":            "#d8dadc",
  "surface-bright":         "#f7f9fb",
  "surface-container-lowest":  "#ffffff",
  "surface-container-low":     "#f2f4f6",
  "surface-container":         "#eceef0",
  "surface-container-high":    "#e6e8ea",
  "surface-container-highest": "#e0e3e5",
  "surface-variant":           "#e0e3e5",
  "inverse-surface":           "#2d3133",
  "inverse-on-surface":        "#eff1f3",

  "on-surface":          "#191c1e",
  "on-surface-variant":  "#464555",
  "on-background":       "#191c1e",

  outline:          "#777587",
  "outline-variant": "#c7c4d8",

  error:             "#ba1a1a",
  "error-container": "#ffdad6",
  "on-error":        "#ffffff",
  "on-error-container": "#93000a",
}
```

```ts
// tailwind.config.ts — typography
fontFamily: {
  "display-xl":        ["Anton", "sans-serif"],
  "headline-lg":       ["Anton", "sans-serif"],
  "headline-lg-mobile":["Anton", "sans-serif"],
  "stats-md":          ["Bebas Neue", "sans-serif"],
  "body-md":           ["Bebas Neue", "sans-serif"],
  "label-sm":          ["Arimo", "sans-serif"],
}
fontSize: {
  "display-xl":         ["72px",  { lineHeight: "80px",  letterSpacing: "0.02em", fontWeight: "400" }],
  "headline-lg":        ["32px",  { lineHeight: "40px",  letterSpacing: "0.04em", fontWeight: "400" }],
  "headline-lg-mobile": ["24px",  { lineHeight: "32px",  fontWeight: "400" }],
  "stats-md":           ["28px",  { lineHeight: "32px",  letterSpacing: "0.05em", fontWeight: "400" }],
  "body-md":            ["16px",  { lineHeight: "24px",  letterSpacing: "0.03em", fontWeight: "400" }],
  "label-sm":           ["12px",  { lineHeight: "16px",  letterSpacing: "0.05em", fontWeight: "600" }],
}
```

```ts
// tailwind.config.ts — spacing & radius
spacing: {
  "margin-safe":        "32px",
  "gutter":             "16px",
  "container-padding":  "24px",
  "grid-unit":          "24px",
}
borderRadius: {
  DEFAULT: "0.25rem",   // 4px  — chips, badges
  lg:      "0.5rem",    // 8px  — inputs
  xl:      "0.75rem",   // 12px — cards
  "2xl":   "1rem",      // 16px — modals
  full:    "9999px",    // pills, avatars
}
```

### 1.2 CSS Utility Classes (globals.css)

```css
/* src/styles/globals.css */
@layer base {
  :root {
    --technical-bg-size: 24px;
  }
}

@layer utilities {
  .technical-bg {
    background-color: theme('colors.surface');
    background-image:
      linear-gradient(to right, rgba(25,28,30,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(25,28,30,0.05) 1px, transparent 1px);
    background-size: var(--technical-bg-size) var(--technical-bg-size);
  }

  .glass-panel {
    background-color: rgba(255,255,255,0.70);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.50);
    box-shadow: 0 4px 30px rgba(0,0,0,0.10);
  }

  .glass-panel-bordered {
    background-color: rgba(255,255,255,0.70);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(25,28,30,0.80);
    box-shadow: 0 4px 24px -8px rgba(88,80,236,0.05);
  }

  .glass-input {
    background-color: rgba(236,238,240,0.50);
    border: 1px solid rgba(199,196,216,0.80);
    backdrop-filter: blur(4px);
    transition: border-color 150ms, box-shadow 150ms;
  }
  .glass-input:focus {
    outline: none;
    border-color: theme('colors.primary');
    box-shadow: 0 0 0 2px rgba(62,50,211,0.20);
  }

  .primary-shadow {
    box-shadow: 0 0 20px rgba(98,80,236,0.30);
  }
}
```

### 1.3 Font Setup (layout.tsx)

```tsx
// src/app/layout.tsx — head fonts
import { Anton } from 'next/font/google'
// Anton and Bebas Neue are not in next/font — load via <link> in metadata or _document
// Arimo is available:
import { Arimo } from 'next/font/google'
```

Since Anton and Bebas Neue aren't in `next/font/google`, add to `src/app/layout.tsx` metadata:

```tsx
export const metadata: Metadata = {
  // ...
  other: {
    'link:fonts': 'https://fonts.googleapis.com/css2?family=Anton&family=Arimo:wght@400;600&family=Bebas+Neue&display=swap'
  }
}
```

And in the root layout `<head>`:
```tsx
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Anton&family=Arimo:wght@400;600&family=Bebas+Neue&display=swap"
/>
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
/>
```

---

## 2. Project Scaffold

### 2.1 Folder Structure

```
synalytix/
├── src/
│   ├── app/
│   │   ├── (auth)/                        # Auth group — no sidebar
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx                 # technical-bg, centered, no nav
│   │   │
│   │   ├── (app)/                         # Authenticated group — sidebar + topnav
│   │   │   ├── layout.tsx                 # AppShell: Sidebar + TopNav + <main>
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   │       ├── MetricCard.tsx
│   │   │   │       ├── ActivityFeed.tsx
│   │   │   │       └── QuickActions.tsx
│   │   │   ├── analytics/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   │       ├── ChartCard.tsx
│   │   │   │       └── DatasetSelector.tsx
│   │   │   ├── insights/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   │       └── InsightCard.tsx
│   │   │   ├── apps/
│   │   │   │   └── page.tsx
│   │   │   ├── studio/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       ├── layout.tsx             # Settings shell: sub-nav + content area
│   │   │       ├── page.tsx               # redirect → /settings/account
│   │   │       ├── account/
│   │   │       │   └── page.tsx
│   │   │       ├── preferences/
│   │   │       │   └── page.tsx
│   │   │       ├── billing/
│   │   │       │   └── page.tsx
│   │   │       ├── team/
│   │   │       │   └── page.tsx
│   │   │       ├── api-keys/
│   │   │       │   └── page.tsx
│   │   │       └── danger/
│   │   │           └── page.tsx
│   │   │
│   │   ├── api/                           # Next.js API routes (thin proxy to backend)
│   │   │   └── [...trpc]/
│   │   │       └── route.ts
│   │   │
│   │   ├── globals.css
│   │   └── layout.tsx                     # Root layout
│   │
│   ├── components/
│   │   ├── ui/                            # shadcn/ui primitives (generated)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── toast.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx               # Collapsible sidebar (w-64 / w-16)
│   │   │   ├── TopNav.tsx                # Sticky header with org switcher
│   │   │   ├── AppShell.tsx              # Sidebar + TopNav + children wrapper
│   │   │   └── SettingsShell.tsx         # Settings sub-nav layout
│   │   │
│   │   ├── shared/
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── PageSkeleton.tsx
│   │   │   ├── MetricBadge.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   └── CommandPalette.tsx        # Cmd+K global search
│   │   │
│   │   └── forms/
│   │       ├── GlassInput.tsx
│   │       ├── GlassButton.tsx
│   │       └── OAuthButton.tsx
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts                 # Axios/fetch wrapper with auth headers
│   │   │   └── trpc.ts                   # tRPC client config
│   │   ├── auth/
│   │   │   ├── session.ts                # JWT decode, token refresh
│   │   │   └── middleware.ts             # Next.js middleware for route protection
│   │   └── utils.ts                      # cn(), formatDate(), etc.
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useOrganization.ts
│   │   ├── useSubscription.ts
│   │   └── usePermissions.ts
│   │
│   ├── stores/
│   │   ├── authStore.ts                  # Zustand: user, tokens
│   │   ├── orgStore.ts                   # Zustand: active org, members
│   │   └── uiStore.ts                    # Zustand: sidebar collapsed, theme
│   │
│   └── types/
│       ├── auth.ts
│       ├── organization.ts
│       ├── dashboard.ts
│       ├── dataset.ts
│       └── billing.ts
│
├── middleware.ts                          # Route protection
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### 2.2 Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000          # Backend base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

---

## 3. Shared Types & Zod Schemas

Create these in `src/types/` — they are the single source of truth for all API contracts.

```ts
// src/types/auth.ts
import { z } from 'zod'

export const RegisterSchema = z.object({
  firstName: z.string().min(1, 'Required').max(50),
  lastName:  z.string().min(1, 'Required').max(50),
  email:     z.string().email('Invalid email'),
  password:  z.string().min(8, 'Min 8 characters')
               .regex(/[A-Z]/, 'Needs uppercase')
               .regex(/[0-9]/, 'Needs a number'),
})
export type RegisterInput = z.infer<typeof RegisterSchema>

export const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})
export type LoginInput = z.infer<typeof LoginSchema>

export interface AuthTokens {
  accessToken:  string   // JWT, 15min
  refreshToken: string   // JWT, 7days
}

export interface AuthUser {
  id:            string
  email:         string
  firstName:     string
  lastName:      string
  avatarUrl:     string | null
  emailVerified: boolean
  createdAt:     string
}

export interface AuthResponse {
  user:   AuthUser
  tokens: AuthTokens
}
```

```ts
// src/types/organization.ts
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
```

```ts
// src/types/billing.ts
export interface SubscriptionPlan {
  tier:        'free' | 'pro' | 'business' | 'enterprise'
  name:        string
  priceMonthly: number
  priceYearly:  number
  features:    string[]
  limits: {
    datasetRows:   number
    aiQueries:     number
    teamSeats:     number
    apiCalls:      number
  }
}

export interface BillingInfo {
  plan:               SubscriptionPlan
  currentPeriodStart: string
  currentPeriodEnd:   string
  cancelAtPeriodEnd:  boolean
  paymentMethod?: {
    brand:    string
    last4:    string
    expMonth: number
    expYear:  number
  }
}
```

```ts
// src/types/dataset.ts
export type SourceType = 'csv' | 'json' | 'api' | 'postgres' | 'mysql' | 'bigquery'

export interface Dataset {
  id:         string
  projectId:  string
  name:       string
  sourceType: SourceType
  rowCount:   number
  sizeBytes:  number
  schemaJson: Record<string, string>   // column → type
  createdAt:  string
  updatedAt:  string
}
```

---

## 4. API Client & Auth Layer

### 4.1 HTTP Client

```ts
// src/lib/api/client.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/authStore'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Request interceptor — attach access token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — silent refresh on 401
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = useAuthStore.getState().refreshToken
        const { data } = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, { refreshToken: refresh })
        useAuthStore.getState().setTokens(data.data.accessToken, data.data.refreshToken)
        original.headers.Authorization = `Bearer ${data.data.accessToken}`
        return apiClient(original)
      } catch {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Standard envelope unwrapper
export async function apiFetch<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: unknown
): Promise<T> {
  const res = await apiClient.request({ method, url, data })
  if (!res.data.success) throw new Error(res.data.error?.message ?? 'Unknown error')
  return res.data.data as T
}
```

### 4.2 Zustand Auth Store

```ts
// src/stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '@/types/auth'

interface AuthState {
  user:         AuthUser | null
  accessToken:  string | null
  refreshToken: string | null
  setAuth:      (user: AuthUser, access: string, refresh: string) => void
  setTokens:    (access: string, refresh: string) => void
  logout:       () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:         null,
      accessToken:  null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    { name: 'synalytix-auth', partialize: (s) => ({ refreshToken: s.refreshToken }) }
  )
)
```

### 4.3 Route Protection Middleware

```ts
// middleware.ts (root)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  const token = req.cookies.get('synalytix-access')?.value

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if (isPublic && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
```

---

## 5. Layout Components

### 5.1 Root Layout

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: { default: 'Synalytix', template: '%s — Synalytix' },
  description: 'AI-powered analytics and automation platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Anton&family=Arimo:wght@400;600&family=Bebas+Neue&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="font-label-sm text-on-surface antialiased">
        {children}
      </body>
    </html>
  )
}
```

### 5.2 Auth Layout (no sidebar)

```tsx
// src/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="technical-bg min-h-screen flex items-center justify-center p-6">
      {children}
    </div>
  )
}
```

### 5.3 Sidebar Component

This is the most critical shared component. Implement it exactly as in the Stitch prototype — fixed, 256px wide, collapsible to 64px icon-only mode.

```tsx
// src/components/layout/Sidebar.tsx
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
  const { user, logout } = useAuthStore()

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
```

### 5.4 Top Navigation

```tsx
// src/components/layout/TopNav.tsx
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
    </header>
  )
}
```

### 5.5 App Shell Layout

```tsx
// src/app/(app)/layout.tsx
import { Sidebar } from '@/components/layout/Sidebar'
import { QueryProvider } from '@/lib/providers/QueryProvider'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthGuard>
        <div className="technical-bg min-h-screen flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto transition-[margin] duration-300">
            {children}
          </main>
        </div>
      </AuthGuard>
    </QueryProvider>
  )
}
```

### 5.6 Settings Shell Layout

```tsx
// src/app/(app)/settings/layout.tsx
import { TopNav } from '@/components/layout/TopNav'
import { SettingsSubNav } from './_components/SettingsSubNav'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav title="Settings" />
      <div className="p-6 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8 mt-4">
        <SettingsSubNav />
        <div className="flex-1 max-w-3xl space-y-8">
          {children}
        </div>
      </div>
      <div className="h-12 flex-shrink-0" />
    </>
  )
}
```

```tsx
// src/app/(app)/settings/_components/SettingsSubNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const SETTINGS_LINKS = [
  { href: '/settings/account',     label: 'Account',     icon: 'person'       },
  { href: '/settings/preferences', label: 'Preferences', icon: 'tune'         },
  { href: '/settings/billing',     label: 'Billing',     icon: 'credit_card'  },
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
```

---

## 6. Auth Pages

### 6.1 Register Page

**Route:** `/register`  
**API:** `POST /api/v1/auth/register`  
**Request body:** `RegisterInput`  
**Response:** `{ success: true, data: AuthResponse }`

```tsx
// src/app/(auth)/register/page.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RegisterSchema, type RegisterInput, type AuthResponse } from '@/types/auth'
import { apiFetch } from '@/lib/api/client'
import { useAuthStore } from '@/stores/authStore'
import { GlassInput } from '@/components/forms/GlassInput'
import { OAuthButton } from '@/components/forms/OAuthButton'

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: RegisterInput) =>
      apiFetch<AuthResponse>('POST', '/auth/register', data),
    onSuccess: ({ user, tokens }) => {
      setAuth(user, tokens.accessToken, tokens.refreshToken)
      router.push('/dashboard')
    },
  })

  return (
    <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* ── Left: Marketing copy ── */}
      <div className="space-y-12">
        <div>
          <span className="inline-flex items-center gap-2 border border-outline-variant rounded-full px-3 py-1 text-xs uppercase tracking-wider font-bold mb-6 bg-white/50 backdrop-blur-sm">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Intelligent Command Center
          </span>
          <h1 className="font-display-xl text-5xl md:text-7xl leading-none text-on-surface mb-2">
            Stop juggling<br />tabs.<br />
            <span className="text-primary relative inline-block">
              Start growing.
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C50 2 150 2 198 10" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
        </div>

        {/* Testimonial */}
        <div className="glass-panel rounded-xl p-6 relative max-w-md">
          <div className="absolute -top-4 -left-4 bg-primary-container text-white w-10 h-10 rounded-full flex items-center justify-center font-display-xl text-2xl">
            "
          </div>
          <p className="text-lg italic text-on-surface-variant mb-4 font-serif">
            "Synalytix transformed our workflow. We've{' '}
            <strong className="text-on-surface">reduced context switching by 40%</strong> in just two weeks."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold text-sm">
              AC
            </div>
            <div>
              <div className="font-bold text-sm">Alex Chen</div>
              <div className="text-xs text-on-surface-variant">CTO @ Synalytix</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Register Form ── */}
      <div className="glass-panel rounded-2xl p-8 md:p-10 shadow-2xl">
        <h2 className="font-headline-lg text-3xl mb-1 uppercase tracking-wider">Synalytix</h2>
        <p className="text-xs text-on-surface-variant mb-8 uppercase tracking-widest">
          Productivity. Social Growth. AI Insights.
        </p>

        <h3 className="font-headline-lg text-4xl mb-2">Create Account</h3>
        <p className="text-on-surface-variant mb-8 text-sm">Set up your free account to get started.</p>

        {/* OAuth */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <OAuthButton provider="google" />
          <OAuthButton provider="github" />
          <OAuthButton provider="twitter" />
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-outline-variant/50" />
          <span className="text-xs text-on-surface-variant uppercase tracking-wider">
            or sign up with email
          </span>
          <div className="flex-1 h-px bg-outline-variant/50" />
        </div>

        {/* Error banner */}
        {mutation.isError && (
          <div className="bg-error-container text-on-error-container rounded-lg px-4 py-3 text-sm mb-6">
            {(mutation.error as Error).message}
          </div>
        )}

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-on-surface-variant uppercase tracking-wider">First Name</label>
              <GlassInput
                {...register('firstName')}
                type="text"
                placeholder="Alex"
                error={errors.firstName?.message}
                autoComplete="given-name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-on-surface-variant uppercase tracking-wider">Last Name</label>
              <GlassInput
                {...register('lastName')}
                type="text"
                placeholder="Chen"
                error={errors.lastName?.message}
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-on-surface-variant uppercase tracking-wider">Email Address</label>
            <GlassInput
              {...register('email')}
              type="email"
              placeholder="name@synalytix.ai"
              icon="email"
              error={errors.email?.message}
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-on-surface-variant uppercase tracking-wider">Password</label>
            <GlassInput
              {...register('password')}
              type="password"
              placeholder="••••••••"
              icon="lock"
              error={errors.password?.message}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-primary hover:bg-primary-container disabled:opacity-60 text-white py-3.5 rounded-full font-bold tracking-wide transition-colors mt-4 text-sm primary-shadow flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
                Creating account…
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-on-surface-variant mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-on-surface font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </main>
  )
}
```

### 6.2 GlassInput Component

```tsx
// src/components/forms/GlassInput.tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string     // Material Symbol name
  error?: string
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ icon, error, className, ...props }, ref) => (
    <div className="relative">
      {icon && (
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-[20px] pointer-events-none select-none">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'glass-input w-full py-3 rounded-full text-sm transition-all duration-150',
          icon ? 'pl-12 pr-4' : 'px-4',
          error && 'border-error focus:border-error focus:shadow-[0_0_0_2px_rgba(186,26,26,0.2)]',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-error text-xs mt-1 ml-4">{error}</p>
      )}
    </div>
  )
)
GlassInput.displayName = 'GlassInput'
```

### 6.3 OAuthButton Component

```tsx
// src/components/forms/OAuthButton.tsx
'use client'

type Provider = 'google' | 'github' | 'twitter'

const PROVIDER_CONFIG: Record<Provider, { label: string; icon: React.ReactNode }> = {
  google: {
    label: 'Google',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  github: {
    label: 'GitHub',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  twitter: {
    label: 'X',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
      </svg>
    ),
  },
}

export function OAuthButton({ provider }: { provider: Provider }) {
  const { label, icon } = PROVIDER_CONFIG[provider]
  const handleOAuth = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/oauth/${provider}`
  }

  return (
    <button
      type="button"
      onClick={handleOAuth}
      className="flex items-center justify-center gap-2 py-2 border border-outline-variant rounded-full hover:bg-white/50 transition-colors text-sm font-bold"
      aria-label={`Sign in with ${label}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
```

---

## 7. Settings Pages

### 7.1 Settings Redirect

```tsx
// src/app/(app)/settings/page.tsx
import { redirect } from 'next/navigation'
export default function SettingsPage() {
  redirect('/settings/account')
}
```

### 7.2 Account Settings

**API:** `GET /api/v1/users/me` · `PATCH /api/v1/users/me`

```tsx
// src/app/(app)/settings/account/page.tsx
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { apiFetch } from '@/lib/api/client'
import { GlassInput } from '@/components/forms/GlassInput'
import type { AuthUser } from '@/types/auth'
import { useEffect } from 'react'
import { toast } from '@/components/ui/toast'

const UpdateProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName:  z.string().min(1),
  email:     z.string().email(),
})
type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>

export default function AccountSettingsPage() {
  const qc = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<AuthUser>('GET', '/users/me'),
  })

  const { register, handleSubmit, reset, formState: { errors, isDirty } } =
    useForm<UpdateProfileInput>({ resolver: zodResolver(UpdateProfileSchema) })

  useEffect(() => {
    if (user) reset({ firstName: user.firstName, lastName: user.lastName, email: user.email })
  }, [user, reset])

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileInput) =>
      apiFetch<AuthUser>('PATCH', '/users/me', data),
    onSuccess: (updated) => {
      qc.setQueryData(['me'], updated)
      toast({ title: 'Profile updated', variant: 'success' })
    },
    onError: (err: Error) => toast({ title: err.message, variant: 'error' }),
  })

  if (isLoading) return <AccountSettingsSkeleton />

  return (
    <div>
      <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1">Account</h3>
      <p className="text-on-surface-variant text-sm mb-8">Manage your personal information and email address.</p>

      <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="space-y-6">
        {/* Avatar */}
        <section className="glass-panel-bordered rounded-xl p-6 space-y-4">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-on-surface-variant">Profile Photo</h4>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold text-2xl font-headline-lg">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <button type="button" className="text-primary text-sm font-semibold hover:underline">
                Upload photo
              </button>
              <p className="text-xs text-on-surface-variant mt-1">JPG, PNG or WebP. Max 2MB.</p>
            </div>
          </div>
        </section>

        {/* Name & Email */}
        <section className="glass-panel-bordered rounded-xl p-6 space-y-5">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-on-surface-variant">Personal Info</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-on-surface-variant uppercase tracking-wider">First Name</label>
              <GlassInput {...register('firstName')} error={errors.firstName?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-on-surface-variant uppercase tracking-wider">Last Name</label>
              <GlassInput {...register('lastName')} error={errors.lastName?.message} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-on-surface-variant uppercase tracking-wider">Email Address</label>
            <GlassInput {...register('email')} type="email" icon="email" error={errors.email?.message} />
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isDirty || updateMutation.isPending}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

function AccountSettingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-surface-container-high rounded w-32" />
      <div className="glass-panel-bordered rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-surface-container-high" />
          <div className="space-y-2">
            <div className="h-4 bg-surface-container-high rounded w-24" />
            <div className="h-3 bg-surface-container rounded w-40" />
          </div>
        </div>
      </div>
      <div className="glass-panel-bordered rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-11 bg-surface-container-high rounded-full" />
          <div className="h-11 bg-surface-container-high rounded-full" />
        </div>
        <div className="h-11 bg-surface-container-high rounded-full" />
      </div>
    </div>
  )
}
```

### 7.3 Billing Settings

**API:** `GET /api/v1/billing/info` · `POST /api/v1/billing/portal` · `POST /api/v1/billing/checkout`

```tsx
// src/app/(app)/settings/billing/page.tsx
'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api/client'
import type { BillingInfo, SubscriptionPlan } from '@/types/billing'
import { cn } from '@/lib/utils'

const PLANS: SubscriptionPlan[] = [
  {
    tier: 'free', name: 'Free', priceMonthly: 0, priceYearly: 0,
    features: ['3 projects', '100K dataset rows', '50 AI queries/mo', '1 seat'],
    limits: { datasetRows: 100_000, aiQueries: 50, teamSeats: 1, apiCalls: 1_000 },
  },
  {
    tier: 'pro', name: 'Pro', priceMonthly: 29, priceYearly: 290,
    features: ['Unlimited projects', '5M dataset rows', '500 AI queries/mo', '5 seats'],
    limits: { datasetRows: 5_000_000, aiQueries: 500, teamSeats: 5, apiCalls: 50_000 },
  },
  {
    tier: 'business', name: 'Business', priceMonthly: 99, priceYearly: 990,
    features: ['Unlimited everything', 'Custom connectors', 'Priority support', '20 seats'],
    limits: { datasetRows: -1, aiQueries: 2_000, teamSeats: 20, apiCalls: 500_000 },
  },
]

export default function BillingSettingsPage() {
  const { data: billing, isLoading } = useQuery({
    queryKey: ['billing'],
    queryFn: () => apiFetch<BillingInfo>('GET', '/billing/info'),
  })

  const portalMutation = useMutation({
    mutationFn: () => apiFetch<{ url: string }>('POST', '/billing/portal'),
    onSuccess: ({ url }) => { window.location.href = url },
  })

  const checkoutMutation = useMutation({
    mutationFn: (tier: string) =>
      apiFetch<{ url: string }>('POST', '/billing/checkout', { tier }),
    onSuccess: ({ url }) => { window.location.href = url },
  })

  if (isLoading) return <BillingSkeleton />

  const currentTier = billing?.plan.tier ?? 'free'

  return (
    <div>
      <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1">Billing</h3>
      <p className="text-on-surface-variant text-sm mb-8">Manage your subscription and payment method.</p>

      {/* Current plan banner */}
      {billing && (
        <div className="glass-panel-bordered rounded-xl p-6 mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Current Plan</p>
            <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface capitalize">
              {billing.plan.name}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Renews {new Date(billing.currentPeriodEnd).toLocaleDateString()}
              {billing.cancelAtPeriodEnd && ' · Cancels at period end'}
            </p>
          </div>
          {billing.paymentMethod && (
            <div className="text-right">
              <p className="text-sm font-semibold capitalize">{billing.paymentMethod.brand} ···· {billing.paymentMethod.last4}</p>
              <button
                onClick={() => portalMutation.mutate()}
                disabled={portalMutation.isPending}
                className="text-primary text-xs font-semibold hover:underline mt-1"
              >
                Manage payment →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const isCurrent = plan.tier === currentTier
          return (
            <div
              key={plan.tier}
              className={cn(
                'rounded-xl p-6 border transition-all',
                isCurrent
                  ? 'border-primary bg-primary/5 shadow-[0_0_0_2px_theme(colors.primary)]'
                  : 'glass-panel-bordered hover:border-primary/50'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{plan.name}</p>
                  <p className="text-2xl font-bold text-on-surface mt-1">
                    {plan.priceMonthly === 0 ? 'Free' : `$${plan.priceMonthly}`}
                    {plan.priceMonthly > 0 && <span className="text-xs text-on-surface-variant font-normal">/mo</span>}
                  </p>
                </div>
                {isCurrent && (
                  <span className="text-xs bg-primary text-on-primary px-2 py-0.5 rounded-full">Current</span>
                )}
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              {!isCurrent && (
                <button
                  onClick={() => checkoutMutation.mutate(plan.tier)}
                  disabled={checkoutMutation.isPending}
                  className="w-full bg-primary text-on-primary py-2.5 rounded-full text-sm font-bold hover:bg-primary-container transition-colors"
                >
                  {plan.priceMonthly > (billing?.plan.priceMonthly ?? 0) ? 'Upgrade' : 'Downgrade'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BillingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-surface-container-high rounded w-24" />
      <div className="h-28 bg-surface-container-high rounded-xl" />
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="h-64 bg-surface-container-high rounded-xl" />)}
      </div>
    </div>
  )
}
```

### 7.4 Team Settings

**API:** `GET /api/v1/orgs/:orgId/members` · `POST /api/v1/orgs/:orgId/invites` · `PATCH /api/v1/orgs/:orgId/members/:userId` · `DELETE /api/v1/orgs/:orgId/members/:userId`

```tsx
// src/app/(app)/settings/team/page.tsx
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
```

### 7.5 API Keys Settings

**API:** `GET /api/v1/orgs/:orgId/api-keys` · `POST /api/v1/orgs/:orgId/api-keys` · `DELETE /api/v1/orgs/:orgId/api-keys/:keyId`

```tsx
// src/app/(app)/settings/api-keys/page.tsx
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
```

### 7.6 Preferences Settings

**API:** `GET /api/v1/users/me/preferences` · `PATCH /api/v1/users/me/preferences`

```tsx
// src/app/(app)/settings/preferences/page.tsx
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
```

### 7.7 Danger Zone

**API:** `DELETE /api/v1/orgs/:orgId` (requires password confirmation)

```tsx
// src/app/(app)/settings/danger/page.tsx
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
```

---

## 8. Zustand Stores

```ts
// src/stores/uiStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarCollapsed:    boolean
  commandPaletteOpen:  boolean
  toggleSidebar:       () => void
  openCommandPalette:  () => void
  closeCommandPalette: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed:    false,
      commandPaletteOpen:  false,
      toggleSidebar:       () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      openCommandPalette:  () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),
    }),
    { name: 'synalytix-ui', partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }) }
  )
)
```

```ts
// src/stores/orgStore.ts
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
```

---

## 9. TanStack Query Provider

```tsx
// src/lib/providers/QueryProvider.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime:        60_000,       // 1 minute
        retry:            1,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

---

## 10. Command Palette (Cmd+K)

```tsx
// src/components/shared/CommandPalette.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

const COMMANDS = [
  { label: 'Go to Dashboard',   icon: 'dashboard',   href: '/dashboard'          },
  { label: 'Go to Analytics',   icon: 'bar_chart',   href: '/analytics'          },
  { label: 'Go to Insights',    icon: 'psychology',  href: '/insights'           },
  { label: 'Account Settings',  icon: 'person',      href: '/settings/account'   },
  { label: 'Billing Settings',  icon: 'credit_card', href: '/settings/billing'   },
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
```

---

## 11. EmptyState & Error Components

```tsx
// src/components/shared/EmptyState.tsx
interface EmptyStateProps {
  icon:        string    // Material Symbol name
  title:       string
  description: string
  action?:     { label: string; onClick: () => void }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">{icon}</span>
      <h3 className="font-semibold text-on-surface mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant max-w-xs mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary-container transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
```

---

## 12. Backend API Contract Reference

Every frontend call maps to a backend route. Implement these endpoints in your backend before wiring the frontend:

| Method   | Endpoint                              | Auth | Body / Query                        | Response                     |
|----------|---------------------------------------|------|-------------------------------------|------------------------------|
| `POST`   | `/api/v1/auth/register`               | ❌   | `RegisterInput`                     | `AuthResponse`               |
| `POST`   | `/api/v1/auth/login`                  | ❌   | `LoginInput`                        | `AuthResponse`               |
| `POST`   | `/api/v1/auth/refresh`                | ❌   | `{ refreshToken: string }`          | `AuthTokens`                 |
| `GET`    | `/api/v1/auth/oauth/:provider`        | ❌   | —                                   | Redirect to OAuth            |
| `GET`    | `/api/v1/users/me`                    | ✅   | —                                   | `AuthUser`                   |
| `PATCH`  | `/api/v1/users/me`                    | ✅   | `Partial<AuthUser>`                 | `AuthUser`                   |
| `GET`    | `/api/v1/users/me/preferences`        | ✅   | —                                   | `UserPreferences`            |
| `PATCH`  | `/api/v1/users/me/preferences`        | ✅   | `Partial<UserPreferences>`          | `UserPreferences`            |
| `GET`    | `/api/v1/orgs/:orgId/members`         | ✅   | —                                   | `OrgMember[]`                |
| `POST`   | `/api/v1/orgs/:orgId/invites`         | ✅   | `{ email, role }`                   | `{ invited: true }`          |
| `DELETE` | `/api/v1/orgs/:orgId/members/:userId` | ✅   | —                                   | `{ removed: true }`          |
| `GET`    | `/api/v1/billing/info`                | ✅   | —                                   | `BillingInfo`                |
| `POST`   | `/api/v1/billing/checkout`            | ✅   | `{ tier: string }`                  | `{ url: string }`            |
| `POST`   | `/api/v1/billing/portal`              | ✅   | —                                   | `{ url: string }`            |
| `GET`    | `/api/v1/orgs/:orgId/api-keys`        | ✅   | —                                   | `ApiKey[]`                   |
| `POST`   | `/api/v1/orgs/:orgId/api-keys`        | ✅   | `{ name: string }`                  | `CreatedApiKey`              |
| `DELETE` | `/api/v1/orgs/:orgId/api-keys/:keyId` | ✅   | —                                   | `{ deleted: true }`          |
| `DELETE` | `/api/v1/orgs/:orgId`                 | ✅   | —                                   | `{ deleted: true }`          |

**Standard response envelope (all endpoints):**
```json
{ "success": true, "data": <T> }
{ "success": false, "error": { "code": "UNAUTHORIZED", "message": "..." } }
```

---

## 13. Implementation Order

Build in this exact sequence to ensure each layer is available to the next:

1. **`tailwind.config.ts`** — paste the full token map from Section 1
2. **`globals.css`** — add `.technical-bg`, `.glass-panel`, `.glass-panel-bordered`, `.glass-input`, `.primary-shadow`
3. **`src/types/`** — all TypeScript interfaces and Zod schemas
4. **`src/lib/api/client.ts`** — HTTP client with interceptors
5. **`src/stores/`** — authStore, orgStore, uiStore
6. **`src/lib/providers/QueryProvider.tsx`** — TanStack Query setup
7. **`middleware.ts`** — route protection
8. **`src/app/layout.tsx`** — root layout with fonts
9. **`src/app/(auth)/layout.tsx`** — auth shell
10. **`src/components/forms/`** — GlassInput, GlassButton, OAuthButton
11. **`src/app/(auth)/register/page.tsx`** — Register page
12. **`src/app/(auth)/login/page.tsx`** — Login page (mirror of register form)
13. **`src/components/layout/Sidebar.tsx`** — Sidebar
14. **`src/components/layout/TopNav.tsx`** — TopNav
15. **`src/app/(app)/layout.tsx`** — App shell
16. **`src/app/(app)/dashboard/page.tsx`** — Dashboard (placeholder metrics)
17. **`src/app/(app)/settings/layout.tsx`** — Settings shell
18. **`src/app/(app)/settings/_components/SettingsSubNav.tsx`** — Sub-nav
19. **Settings pages** — account → preferences → billing → team → api-keys → danger
20. **`src/components/shared/CommandPalette.tsx`** — Cmd+K
21. **Analytics, Insights, Studio, Apps pages** — extend after foundation is stable

---

## 14. Package Installation Commands

```bash
# Core
npx create-next-app@latest synalytix --typescript --tailwind --app --src-dir --import-alias "@/*"
cd synalytix

# UI & state
npm install @radix-ui/react-avatar @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-tooltip @radix-ui/react-slot
npm install class-variance-authority clsx tailwind-merge lucide-react

# shadcn/ui setup
npx shadcn-ui@latest init

# Forms & validation
npm install react-hook-form @hookform/resolvers zod

# Data fetching & state
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install zustand

# HTTP client
npm install axios

# Charts (for analytics pages)
npm install recharts

# Dev
npm install -D @types/node prettier eslint-config-prettier
```

---

## 15. Key Conventions

- **Server Components by default** — mark `'use client'` only for forms, charts, and interactive hooks
- **Co-locate feature components** — `settings/_components/` not `components/settings/`
- **No `any` types** — use `unknown` and narrow with Zod or type guards
- **Loading states always** — every `useQuery` needs a skeleton, never a blank flash
- **Error states always** — every mutation needs an `onError` handler with a toast
- **Empty states always** — every list needs a zero-state with a CTA
- **Accessibility** — all interactive elements need `aria-label` when icon-only
- **Keyboard nav** — Sidebar supports Tab, Enter; Command Palette supports ↑↓ Enter Esc
- **CSS class order** — layout → spacing → typography → color → border → shadow → animation
