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
