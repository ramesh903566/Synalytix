import { Sidebar } from '@/components/layout/Sidebar'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="technical-bg min-h-screen flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-y-auto transition-[margin] duration-300">
           <div className="ml-64 sidebar-content">
              {children}
           </div>
        </main>
      </div>
    </AuthGuard>
  )
}
