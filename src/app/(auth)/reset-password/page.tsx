'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PasswordResetForm } from '@/components/auth/PasswordResetForm'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

function ResetPasswordContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const code = searchParams.get('code')

    // If there's a token or code in the URL, show the reset form
    // Otherwise show the request form
    const mode = token || code ? 'reset' : 'request'

    return <PasswordResetForm mode={mode} token={token || code || undefined} />
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<LoadingSpinner size="lg" text="Loading..." />}>
            <ResetPasswordContent />
        </Suspense>
    )
}
