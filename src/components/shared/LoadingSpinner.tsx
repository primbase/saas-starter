'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
    text?: string
}

/**
 * Loading spinner component with optional text
 */
export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-10 w-10',
    }

    return (
        <div className={cn('flex items-center justify-center gap-2', className)}>
            <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
            {text && <span className="text-muted-foreground text-sm">{text}</span>}
        </div>
    )
}

/**
 * Full page loading spinner
 */
export function PageLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-primary/20" />
                    <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary" />
                </div>
                <span className="text-muted-foreground text-sm">Loading...</span>
            </div>
        </div>
    )
}
