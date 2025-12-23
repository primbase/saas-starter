'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    BarChart3,
    FileText,
    Calendar,
    Bell,
    User,
    Settings,
    HelpCircle,
    Search,
    Moon,
    Sun,
    LogOut,
    Shield,
    Palette,
    CreditCard,
} from 'lucide-react'
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import { useTheme } from '@/hooks/useTheme'

interface CommandPaletteProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const navigationItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, keywords: ['home', 'main'] },
    { label: 'Analytics', href: '/analytics', icon: BarChart3, keywords: ['charts', 'stats', 'data'] },
    { label: 'Documents', href: '/documents', icon: FileText, keywords: ['files', 'folders', 'storage'] },
    { label: 'Calendar', href: '/calendar', icon: Calendar, keywords: ['events', 'schedule', 'meetings'] },
    { label: 'Notifications', href: '/notifications', icon: Bell, keywords: ['alerts', 'messages'] },
]

const settingsItems = [
    { label: 'Profile Settings', href: '/settings/profile', icon: User, keywords: ['avatar', 'name', 'bio'] },
    { label: 'Account Settings', href: '/settings/account', icon: CreditCard, keywords: ['email', 'password', 'delete'] },
    { label: 'Preferences', href: '/settings/preferences', icon: Palette, keywords: ['theme', 'notifications'] },
    { label: 'Security', href: '/settings/security', icon: Shield, keywords: ['sessions', '2fa', 'login'] },
    { label: 'Help & Docs', href: '/help', icon: HelpCircle, keywords: ['documentation', 'faq', 'guide'] },
]

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
    const router = useRouter()
    const { resolvedTheme, setTheme } = useTheme()

    const runCommand = useCallback((command: () => void) => {
        onOpenChange(false)
        command()
    }, [onOpenChange])

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                {/* Navigation */}
                <CommandGroup heading="Navigation">
                    {navigationItems.map((item) => (
                        <CommandItem
                            key={item.href}
                            value={`${item.label} ${item.keywords.join(' ')}`}
                            onSelect={() => runCommand(() => router.push(item.href))}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.label}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandSeparator />

                {/* Settings */}
                <CommandGroup heading="Settings">
                    {settingsItems.map((item) => (
                        <CommandItem
                            key={item.href}
                            value={`${item.label} ${item.keywords.join(' ')}`}
                            onSelect={() => runCommand(() => router.push(item.href))}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.label}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandSeparator />

                {/* Actions */}
                <CommandGroup heading="Actions">
                    <CommandItem
                        value="toggle theme dark light mode"
                        onSelect={() => runCommand(() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'))}
                    >
                        {resolvedTheme === 'dark' ? (
                            <Sun className="mr-2 h-4 w-4" />
                        ) : (
                            <Moon className="mr-2 h-4 w-4" />
                        )}
                        <span>Toggle Theme</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}

// Hook for managing command palette state
export function useCommandPalette() {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    return { open, setOpen }
}
