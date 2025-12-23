'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    User,
    Settings,
    HelpCircle,
    FileText,
    BarChart3,
    Calendar,
    Sparkles,
    X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

interface MobileSidebarProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const mainNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Documents', href: '/documents', icon: FileText },
    { label: 'Calendar', href: '/calendar', icon: Calendar },
]

const bottomNavItems = [
    { label: 'Profile', href: '/settings/profile', icon: User },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Help & Docs', href: '/help', icon: HelpCircle },
]

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard'
        }
        return pathname.startsWith(href)
    }

    const handleNavClick = () => {
        onOpenChange(false)
    }

    const NavItem = ({ item }: { item: typeof mainNavItems[0] }) => {
        const active = isActive(item.href)

        return (
            <Link
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                    'hover:bg-accent group',
                    active && 'bg-primary text-primary-foreground hover:bg-primary/90',
                    !active && 'text-foreground'
                )}
            >
                <item.icon className={cn(
                    'h-5 w-5 flex-shrink-0 transition-transform',
                    !active && 'group-hover:scale-110'
                )} />
                <span className="text-sm font-medium">{item.label}</span>
            </Link>
        )
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="px-4 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center gap-2" onClick={handleNavClick}>
                            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <SheetTitle className="font-bold text-lg">AppTemplate</SheetTitle>
                        </Link>
                    </div>
                </SheetHeader>

                <div className="flex flex-col h-[calc(100vh-73px)]">
                    {/* Main Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {mainNavItems.map((item) => (
                            <NavItem key={item.href} item={item} />
                        ))}
                    </nav>

                    {/* Bottom Navigation */}
                    <div className="px-3 py-4 border-t space-y-1">
                        {bottomNavItems.map((item) => (
                            <NavItem key={item.href} item={item} />
                        ))}
                        <p className="text-[10px] text-muted-foreground text-center mt-4">
                            Version 1.0.0
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
