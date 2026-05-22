import { z } from 'zod'

export const RegisterSchema = z.object({
  firstName: z.string().min(1, 'Required').max(50),
  lastName:  z.string().min(1, 'Required').max(50),
  email:     z.string().email('Invalid email'),
  password:  z.string().min(8, 'Min 8 characters')
               .regex(/[A-Z]/, 'Needs uppercase')
               .regex(/[0-9]/, 'Needs a number'),
})
export type RegisterInput = z.infer<typeof RegisterSchema>

export const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})
export type LoginInput = z.infer<typeof LoginSchema>

export interface AuthTokens {
  accessToken:  string   // JWT, 15min
  refreshToken: string   // JWT, 7days
}

export interface AuthUser {
  id:            string
  email:         string
  firstName:     string
  lastName:      string
  avatarUrl:     string | null
  emailVerified: boolean
  createdAt:     string
}

export interface AuthResponse {
  user:   AuthUser
  tokens: AuthTokens
}
