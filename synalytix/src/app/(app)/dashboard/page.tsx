'use client'

import { TopNav } from '@/components/layout/TopNav'
import { useAuthStore } from '@/stores/authStore'

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <>
      <TopNav title="Dashboard" />
      <div className="p-6">
        <h1 className="font-headline-lg text-4xl mb-4">Welcome back, {user?.firstName || 'User'}!</h1>
        <p className="text-on-surface-variant">This is your intelligent command center. Start by exploring your apps or analytics.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel-bordered rounded-xl p-6 h-40 flex items-center justify-center border-dashed">
              <span className="text-on-surface-variant opacity-50">Metric Widget {i}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
