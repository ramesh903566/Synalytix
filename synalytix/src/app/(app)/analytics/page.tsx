'use client'

import { TopNav } from '@/components/layout/TopNav'

export default function AnalyticsPage() {
  return (
    <>
      <TopNav title="Analytics" />
      <div className="p-6">
        <h1 className="font-headline-lg text-4xl mb-4">Analytics</h1>
        <p className="text-on-surface-variant">Analyze your data with AI-powered insights.</p>
        <div className="glass-panel-bordered rounded-xl p-12 mt-8 text-center border-dashed">
            <span className="material-symbols-outlined text-6xl opacity-20 block mb-4">bar_chart</span>
            <p className="text-on-surface-variant opacity-50">Charts and data visualizations will appear here.</p>
        </div>
      </div>
    </>
  )
}
