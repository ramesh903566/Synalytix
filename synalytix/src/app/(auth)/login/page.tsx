'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LoginSchema, type LoginInput, type AuthResponse } from '@/types/auth'
import { apiFetch } from '@/lib/api/client'
import { useAuthStore } from '@/stores/authStore'
import { GlassInput } from '@/components/forms/GlassInput'
import { OAuthButton } from '@/components/forms/OAuthButton'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: LoginInput) =>
      apiFetch<AuthResponse>('POST', '/auth/login', data),
    onSuccess: ({ user, tokens }) => {
      setAuth(user, tokens.accessToken, tokens.refreshToken)
      router.push('/dashboard')
    },
  })

  return (
    <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* ── Left: Marketing copy ── */}
      <div className="space-y-12">
        <div>
          <span className="inline-flex items-center gap-2 border border-outline-variant rounded-full px-3 py-1 text-xs uppercase tracking-wider font-bold mb-6 bg-white/50 backdrop-blur-sm">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Intelligent Command Center
          </span>
          <h1 className="font-display-xl text-5xl md:text-7xl leading-none text-on-surface mb-2">
            Back to<br />business.<br />
            <span className="text-primary relative inline-block">
              Better than ever.
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C50 2 150 2 198 10" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
        </div>

        {/* Testimonial */}
        <div className="glass-panel rounded-xl p-6 relative max-w-md">
          <div className="absolute -top-4 -left-4 bg-primary-container text-white w-10 h-10 rounded-full flex items-center justify-center font-display-xl text-2xl">
            "
          </div>
          <p className="text-lg italic text-on-surface-variant mb-4 font-serif">
            "The insights we get from Synalytix are{' '}
            <strong className="text-on-surface">game-changing</strong>. I can't imagine working without it now."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold text-sm">
              JS
            </div>
            <div>
              <div className="font-bold text-sm">Jane Smith</div>
              <div className="text-xs text-on-surface-variant">Head of Growth @ TechScale</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Login Form ── */}
      <div className="glass-panel rounded-2xl p-8 md:p-10 shadow-2xl">
        <h2 className="font-headline-lg text-3xl mb-1 uppercase tracking-wider">Synalytix</h2>
        <p className="text-xs text-on-surface-variant mb-8 uppercase tracking-widest">
          Productivity. Social Growth. AI Insights.
        </p>

        <h3 className="font-headline-lg text-4xl mb-2">Welcome Back</h3>
        <p className="text-on-surface-variant mb-8 text-sm">Sign in to your account to continue.</p>

        {/* OAuth */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <OAuthButton provider="google" />
          <OAuthButton provider="github" />
          <OAuthButton provider="twitter" />
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-outline-variant/50" />
          <span className="text-xs text-on-surface-variant uppercase tracking-wider">
            or sign in with email
          </span>
          <div className="flex-1 h-px bg-outline-variant/50" />
        </div>

        {/* Error banner */}
        {mutation.isError && (
          <div className="bg-error-container text-on-error-container rounded-lg px-4 py-3 text-sm mb-6">
            {(mutation.error as Error).message}
          </div>
        )}

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5" noValidate>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-on-surface-variant uppercase tracking-wider">Email Address</label>
            <GlassInput
              {...register('email')}
              type="email"
              placeholder="name@synalytix.ai"
              icon="email"
              error={errors.email?.message}
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs text-on-surface-variant uppercase tracking-wider">Password</label>
              <Link href="/forgot-password" className="text-[10px] text-primary hover:underline uppercase tracking-widest font-bold">
                Forgot?
              </Link>
            </div>
            <GlassInput
              {...register('password')}
              type="password"
              placeholder="••••••••"
              icon="lock"
              error={errors.password?.message}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-primary hover:bg-primary-container disabled:opacity-60 text-white py-3.5 rounded-full font-bold tracking-wide transition-colors mt-4 text-sm primary-shadow flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-on-surface-variant mt-8">
          Don't have an account?{' '}
          <Link href="/register" className="text-on-surface font-bold hover:underline">
            Create one here
          </Link>
        </p>
      </div>
    </main>
  )
}
