'use client'

import { TopNav } from '@/components/layout/TopNav'

export default function StudioPage() {
  return (
    <>
      <TopNav title="Studio" />
      <div className="p-6">
        <h1 className="font-headline-lg text-4xl mb-4">Studio</h1>
        <p className="text-on-surface-variant">Build and customize your analytics models.</p>
        <div className="glass-panel-bordered rounded-xl p-12 mt-8 text-center border-dashed">
            <span className="material-symbols-outlined text-6xl opacity-20 block mb-4">auto_awesome</span>
            <p className="text-on-surface-variant opacity-50">Your creative studio space.</p>
        </div>
      </div>
    </>
  )
}
