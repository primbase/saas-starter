'use client'

import { LucideIcon, FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
    icon?: LucideIcon
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
    className?: string
}

/**
 * Empty state component for displaying when there's no data
 */
export function EmptyState({
    icon: Icon = FileQuestion,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center py-12 px-4 text-center',
                className
            )}
        >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Icon className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
            {description && (
                <p className="text-muted-foreground text-sm max-w-md mb-6">{description}</p>
            )}
            {action && (
                <Button onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    )
}
