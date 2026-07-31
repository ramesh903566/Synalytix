import { Outlet } from "react-router-dom"
import { Sidebar } from "../components/navigation/sidebar"
import { TopBar } from "../components/navigation/top-bar"
import { useSidebar } from "../hooks/useSidebar"
import { useIsDesktop } from "../hooks/useMediaQuery"
import { cn } from "../lib/utils"
import { motion, AnimatePresence } from "motion/react"

export default function AppLayout() {
  const { collapsed, toggle, mobileOpen, toggleMobile, closeMobile } = useSidebar()
  const isDesktop = useIsDesktop()

  return (
    <div className="flex h-screen w-full bg-bg-canvas text-text-primary font-body overflow-hidden">
      {/* Desktop/Tablet Sidebar */}
      {isDesktop && <Sidebar collapsed={collapsed} onToggle={toggle} />}

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {!isDesktop && mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="fixed inset-0 bg-text-primary/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: -264 }}
              animate={{ x: 0 }}
              exit={{ x: -264 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50"
            >
              <Sidebar collapsed={false} onToggle={closeMobile} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuClick={toggleMobile} showMenu={!isDesktop} />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[var(--content-max-width)] mx-auto p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
