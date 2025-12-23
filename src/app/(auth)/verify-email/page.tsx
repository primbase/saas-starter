'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, ArrowLeft, RefreshCw, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { resendVerificationEmail } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const email = searchParams.get('email') || ''
    const [isResending, setIsResending] = useState(false)
    const [countdown, setCountdown] = useState(0)

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const handleResend = async () => {
        if (countdown > 0 || !email) return

        setIsResending(true)
        try {
            const { error } = await resendVerificationEmail(email)

            if (error) {
                toast.error('Failed to resend verification email')
                return
            }

            toast.success('Verification email sent!')
            setCountdown(60)
        } catch (err) {
            toast.error('Unable to resend email. Please try again.')
        } finally {
            setIsResending(false)
        }
    }

    return (
        <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
                <CardDescription className="text-base">
                    We&apos;ve sent a verification link to:
                </CardDescription>
                {email && (
                    <p className="font-medium text-foreground">{email}</p>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-sm">Next steps:</h4>
                    <ol className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">1</span>
                            <span>Check your email inbox (and spam folder)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">2</span>
                            <span>Click the verification link in the email</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">3</span>
                            <span>You&apos;ll be automatically signed in</span>
                        </li>
                    </ol>
                </div>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                        Didn&apos;t receive the email?
                    </p>
                    <Button
                        variant="outline"
                        onClick={handleResend}
                        disabled={isResending || countdown > 0 || !email}
                        className="w-full"
                    >
                        {isResending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : countdown > 0 ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Resend in {countdown}s
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Resend verification email
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <Button variant="ghost" asChild className="flex-1">
                        <Link href="/login">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to login
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild className="flex-1">
                        <Link href="/signup">Use different email</Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<LoadingSpinner size="lg" text="Loading..." />}>
            <VerifyEmailContent />
        </Suspense>
    )
}
