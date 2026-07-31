import { lazy, Suspense, useState, useEffect, useCallback } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "../components/navigation/sidebar"
import { TopBar } from "../components/navigation/top-bar"
import { CommandPalette } from "../components/dashboard/CommandPalette"
import { useSidebar } from "../hooks/useSidebar"
import { useIsDesktop } from "../hooks/useMediaQuery"
import { cn } from "../lib/utils"
import { motion, AnimatePresence } from "motion/react"

const ChatPanel = lazy(() =>
  import("../components/chat/ChatPanel").then((m) => ({ default: m.ChatPanel }))
)

export default function AppLayout() {
  const { collapsed, toggle, mobileOpen, toggleMobile, closeMobile } = useSidebar()
  const isDesktop = useIsDesktop()
  const [searchOpen, setSearchOpen] = useState(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault()
      setSearchOpen((o) => !o)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

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
        <TopBar onMenuClick={toggleMobile} showMenu={!isDesktop} onSearchOpen={() => setSearchOpen(true)} />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[var(--content-max-width)] mx-auto p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Command Palette */}
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Chat Panel — lazy-loaded, only renders when opened */}
      <Suspense fallback={null}>
        <ChatPanel />
      </Suspense>
    </div>
  )
}
