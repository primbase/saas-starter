'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Palette, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

const settingsTabs = [
    { label: 'Profile', href: '/settings/profile', icon: User },
    { label: 'Account', href: '/settings/account', icon: Mail },
    { label: 'Preferences', href: '/settings/preferences', icon: Palette },
    { label: 'Security', href: '/settings/security', icon: Shield },
]

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            {/* Settings Content */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Tabs - Vertical on desktop, horizontal on mobile */}
                <nav className="lg:w-48 flex-shrink-0">
                    {/* Desktop Tabs */}
                    <div className="hidden lg:flex flex-col space-y-1">
                        {settingsTabs.map((tab) => (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                    pathname === tab.href
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Tabs */}
                    <div className="flex lg:hidden overflow-x-auto pb-2 -mx-4 px-4 gap-2">
                        {settingsTabs.map((tab) => (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                                    pathname === tab.href
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground hover:text-foreground'
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    {children}
                </div>
            </div>
        </div>
    )
}
