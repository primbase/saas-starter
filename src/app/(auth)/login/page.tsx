import { LoginForm } from '@/components/auth/LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign In | AppTemplate',
    description: 'Sign in to your account to access your dashboard.',
}

export default function LoginPage() {
    return <LoginForm />
}
