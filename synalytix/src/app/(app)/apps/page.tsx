'use client'

import { TopNav } from '@/components/layout/TopNav'

export default function AppsPage() {
  return (
    <>
      <TopNav title="Apps" />
      <div className="p-6">
        <h1 className="font-headline-lg text-4xl mb-4">Apps</h1>
        <p className="text-on-surface-variant">Connect and manage your third-party applications.</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            {['GitHub', 'Slack', 'Instagram', 'Twitter'].map(app => (
                <div key={app} className="glass-panel-bordered rounded-xl p-6 flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center">
                        <span className="material-symbols-outlined">extension</span>
                    </div>
                    <span className="font-bold text-sm">{app}</span>
                </div>
            ))}
        </div>
      </div>
    </>
  )
}
