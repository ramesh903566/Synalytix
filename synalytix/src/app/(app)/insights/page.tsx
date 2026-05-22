'use client'

import { TopNav } from '@/components/layout/TopNav'

export default function InsightsPage() {
  return (
    <>
      <TopNav title="Insights" />
      <div className="p-6">
        <h1 className="font-headline-lg text-4xl mb-4">Insights</h1>
        <p className="text-on-surface-variant">AI-generated reports and anomaly detection.</p>
        <div className="glass-panel-bordered rounded-xl p-12 mt-8 text-center border-dashed">
            <span className="material-symbols-outlined text-6xl opacity-20 block mb-4">psychology</span>
            <p className="text-on-surface-variant opacity-50">Intelligent insights will be delivered here.</p>
        </div>
      </div>
    </>
  )
}
