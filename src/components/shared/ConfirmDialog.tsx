'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'default' | 'destructive'
    confirmText?: string // If provided, user must type this to confirm
    onConfirm: () => void
    loading?: boolean
}

/**
 * Confirmation dialog component with optional text confirmation
 */
export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'default',
    confirmText,
    onConfirm,
    loading = false,
}: ConfirmDialogProps) {
    const [inputValue, setInputValue] = useState('')

    const isConfirmDisabled = confirmText
        ? inputValue !== confirmText || loading
        : loading

    const handleConfirm = () => {
        if (!isConfirmDisabled) {
            onConfirm()
            setInputValue('')
        }
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setInputValue('')
        }
        onOpenChange(newOpen)
    }

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                {confirmText && (
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground mb-2">
                            Type <span className="font-mono font-bold text-foreground">{confirmText}</span> to confirm
                        </p>
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={confirmText}
                            className="font-mono"
                        />
                    </div>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isConfirmDisabled}
                        className={cn(
                            variant === 'destructive' &&
                            'bg-destructive text-white hover:bg-destructive/90'
                        )}
                    >
                        {loading ? 'Processing...' : confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
