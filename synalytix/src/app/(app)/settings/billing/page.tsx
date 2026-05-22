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
