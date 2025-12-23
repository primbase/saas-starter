'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, Lock, User, Loader2, Check, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { signupSchema, type SignupFormData, getPasswordStrength } from '@/lib/validations'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export function SignupForm() {
    const router = useRouter()
    const { signUp } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [acceptedTerms, setAcceptedTerms] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
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

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true)
        try {
            const { error, needsVerification } = await signUp(data.email, data.password, data.fullName)

            if (error) {
                if (error.message.includes('already registered')) {
                    toast.error('An account with this email already exists')
                } else {
                    toast.error(error.message)
                }
                return
            }

            toast.success('Account created! Please check your email to verify your account.')
            router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
        } catch (err) {
            toast.error('Unable to create account. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                <CardDescription>
                    Enter your details to get started
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {/* Full Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="John Doe"
                                className="pl-10"
                                {...register('fullName')}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.fullName && (
                            <p className="text-sm text-destructive">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
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

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
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
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
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
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
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
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Terms Checkbox */}
                    <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="acceptTerms"
                                checked={acceptedTerms}
                                onCheckedChange={(checked) => {
                                    setAcceptedTerms(checked === true)
                                    setValue('acceptTerms', checked === true, { shouldValidate: true })
                                }}
                            />
                            <Label
                                htmlFor="acceptTerms"
                                className="text-sm font-normal leading-relaxed cursor-pointer"
                            >
                                I agree to the{' '}
                                <Link href="/terms" className="text-primary hover:underline">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-primary hover:underline">
                                    Privacy Policy
                                </Link>
                            </Label>
                        </div>
                        {errors.acceptTerms && (
                            <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            'Create account'
                        )}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}
