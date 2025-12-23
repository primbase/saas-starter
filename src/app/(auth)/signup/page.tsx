import { SignupForm } from '@/components/auth/SignupForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create Account | AppTemplate',
    description: 'Create a new account to get started with AppTemplate.',
}

export default function SignupPage() {
    return <SignupForm />
}
