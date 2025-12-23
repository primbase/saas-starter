'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowLeft, Check, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    resetPasswordRequestSchema,
    resetPasswordSchema,
    type ResetPasswordRequestData,
    type ResetPasswordData,
    getPasswordStrength
} from '@/lib/validations'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface PasswordResetFormProps {
    mode: 'request' | 'reset'
    token?: string
}

export function PasswordResetForm({ mode, token }: PasswordResetFormProps) {
    if (mode === 'reset') {
        return <ResetPasswordStep />
    }
    return <RequestResetStep />
}

function RequestResetStep() {
    const { resetPassword } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<ResetPasswordRequestData>({
        resolver: zodResolver(resetPasswordRequestSchema),
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = async (data: ResetPasswordRequestData) => {
        setIsLoading(true)
        try {
            const { error } = await resetPassword(data.email)

            if (error) {
                // Don't reveal if email exists for security
                toast.error('Something went wrong. Please try again.')
                return
            }

            setIsSuccess(true)
            toast.success('Reset link sent!')
        } catch (err) {
            toast.error('Unable to send reset link. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                        <Mail className="h-6 w-6 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                    <CardDescription className="text-base">
                        If an account exists with <strong>{getValues('email')}</strong>, you&apos;ll receive a password reset link shortly.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col space-y-4">
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/login">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to login
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
                <CardDescription>
                    Enter your email address and we&apos;ll send you a reset link
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="pl-10"
                                {...register('email')}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            'Send reset link'
                        )}
                    </Button>

                    <Link
                        href="/login"
                        className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to login
                    </Link>
                </CardFooter>
            </form>
        </Card>
    )
}

function ResetPasswordStep() {
    const { updatePassword } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    const password = watch('password', '')
    const passwordStrength = getPasswordStrength(password)

    const passwordRequirements = [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'One lowercase letter', met: /[a-z]/.test(password) },
        { label: 'One number', met: /[0-9]/.test(password) },
    ]

    const onSubmit = async (data: ResetPasswordData) => {
        setIsLoading(true)
        try {
            const { error } = await updatePassword(data.password)

            if (error) {
                toast.error(error.message)
                return
            }

            setIsSuccess(true)
            toast.success('Password updated successfully!')
        } catch (err) {
            toast.error('Unable to update password. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                        <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Password updated</CardTitle>
                    <CardDescription className="text-base">
                        Your password has been successfully reset. You can now sign in with your new password.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col space-y-4">
                    <Button asChild className="w-full">
                        <Link href="/login">
                            Sign in
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">Set new password</CardTitle>
                <CardDescription>
                    Create a strong password for your account
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {/* New Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a strong password"
                                className="pl-10 pr-10"
                                {...register('password')}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        {/* Password Strength */}
                        {password && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                'h-full transition-all duration-300',
                                                passwordStrength === 'weak' && 'w-1/3 bg-destructive',
                                                passwordStrength === 'medium' && 'w-2/3 bg-yellow-500',
                                                passwordStrength === 'strong' && 'w-full bg-green-500'
                                            )}
                                        />
                                    </div>
                                    <span className={cn(
                                        'text-xs font-medium capitalize',
                                        passwordStrength === 'weak' && 'text-destructive',
                                        passwordStrength === 'medium' && 'text-yellow-600',
                                        passwordStrength === 'strong' && 'text-green-600'
                                    )}>
                                        {passwordStrength}
                                    </span>
                                </div>
                                <ul className="space-y-1">
                                    {passwordRequirements.map((req, i) => (
                                        <li key={i} className="flex items-center gap-2 text-xs">
                                            {req.met ? (
                                                <Check className="h-3 w-3 text-green-500" />
                                            ) : (
                                                <X className="h-3 w-3 text-muted-foreground" />
                                            )}
                                            <span className={req.met ? 'text-green-600' : 'text-muted-foreground'}>
                                                {req.label}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                className="pl-10 pr-10"
                                {...register('confirmPassword')}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update password'
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
