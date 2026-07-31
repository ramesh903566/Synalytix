import { useState, useCallback, useEffect } from "react"

const STORAGE_KEY = "synalytix-sidebar-collapsed"

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true"
    } catch {
      return false
    }
  })

  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed))
    } catch {}
  }, [collapsed])

  const toggle = useCallback(() => setCollapsed((c) => !c), [])
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return { collapsed, toggle, mobileOpen, toggleMobile, closeMobile }
}
