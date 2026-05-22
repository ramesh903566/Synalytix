'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { accessToken } = useAuthStore()

  useEffect(() => {
    if (!accessToken) {
      router.push('/login')
    }
  }, [accessToken, router])

  if (!accessToken) return null

  return <>{children}</>
}
