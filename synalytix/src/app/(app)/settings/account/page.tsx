'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { apiFetch } from '@/lib/api/client'
import { GlassInput } from '@/components/forms/GlassInput'
import type { AuthUser } from '@/types/auth'
import { useEffect } from 'react'
import { toast } from 'sonner'

const UpdateProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName:  z.string().min(1),
  email:     z.string().email(),
})
type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>

export default function AccountSettingsPage() {
  const qc = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<AuthUser>('GET', '/users/me'),
  })

  const { register, handleSubmit, reset, formState: { errors, isDirty } } =
    useForm<UpdateProfileInput>({ resolver: zodResolver(UpdateProfileSchema) })

  useEffect(() => {
    if (user) reset({ firstName: user.firstName, lastName: user.lastName, email: user.email })
  }, [user, reset])

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileInput) =>
      apiFetch<AuthUser>('PATCH', '/users/me', data),
    onSuccess: (updated) => {
      qc.setQueryData(['me'], updated)
      toast.success('Profile updated')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  if (isLoading) return <AccountSettingsSkeleton />

  return (
    <div>
      <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1">Account</h3>
      <p className="text-on-surface-variant text-sm mb-8">Manage your personal information and email address.</p>

      <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="space-y-6">
        {/* Avatar */}
        <section className="glass-panel-bordered rounded-xl p-6 space-y-4">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-on-surface-variant">Profile Photo</h4>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold text-2xl font-headline-lg">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <button type="button" className="text-primary text-sm font-semibold hover:underline">
                Upload photo
              </button>
              <p className="text-xs text-on-surface-variant mt-1">JPG, PNG or WebP. Max 2MB.</p>
            </div>
          </div>
        </section>

        {/* Name & Email */}
        <section className="glass-panel-bordered rounded-xl p-6 space-y-5">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-on-surface-variant">Personal Info</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-on-surface-variant uppercase tracking-wider">First Name</label>
              <GlassInput {...register('firstName')} error={errors.firstName?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-on-surface-variant uppercase tracking-wider">Last Name</label>
              <GlassInput {...register('lastName')} error={errors.lastName?.message} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-on-surface-variant uppercase tracking-wider">Email Address</label>
            <GlassInput {...register('email')} type="email" icon="email" error={errors.email?.message} />
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isDirty || updateMutation.isPending}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

function AccountSettingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-surface-container-high rounded w-32" />
      <div className="glass-panel-bordered rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-surface-container-high" />
          <div className="space-y-2">
            <div className="h-4 bg-surface-container-high rounded w-24" />
            <div className="h-3 bg-surface-container rounded w-40" />
          </div>
        </div>
      </div>
      <div className="glass-panel-bordered rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-11 bg-surface-container-high rounded-full" />
          <div className="h-11 bg-surface-container-high rounded-full" />
        </div>
        <div className="h-11 bg-surface-container-high rounded-full" />
      </div>
    </div>
  )
}
