import { z } from 'zod'

/**
 * Password validation schema with strength requirements
 */
const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Signup form validation schema
 */
export const signupSchema = z
    .object({
        fullName: z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(50, 'Name must not exceed 50 characters')
            .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
        email: z.string().email('Please enter a valid email address'),
        password: passwordSchema,
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        acceptTerms: z.boolean().refine((val) => val === true, {
            message: 'You must accept the terms and conditions',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

export type SignupFormData = z.infer<typeof signupSchema>

/**
 * Password reset request schema
 */
export const resetPasswordRequestSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
})

export type ResetPasswordRequestData = z.infer<typeof resetPasswordRequestSchema>

/**
 * Password reset (new password) schema
 */
export const resetPasswordSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>

/**
 * Profile settings schema
 */
export const profileSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    bio: z.string().max(500, 'Bio must not exceed 500 characters').optional().or(z.literal('')),
    location: z.string().max(100, 'Location must not exceed 100 characters').optional().or(z.literal('')),
    website: z
        .string()
        .url('Please enter a valid URL')
        .optional()
        .or(z.literal('')),
})

export type ProfileFormData = z.infer<typeof profileSchema>

/**
 * Change email schema
 */
export const changeEmailSchema = z.object({
    newEmail: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required to change email'),
})

export type ChangeEmailData = z.infer<typeof changeEmailSchema>

/**
 * Change password schema
 */
export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: passwordSchema,
        confirmPassword: z.string().min(1, 'Please confirm your new password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

export type ChangePasswordData = z.infer<typeof changePasswordSchema>

/**
 * Helper to calculate password strength
 * Returns: 'weak' | 'medium' | 'strong'
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
    if (password.length < 8) return 'weak'

    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score >= 5) return 'strong'
    if (score >= 3) return 'medium'
    return 'weak'
}
