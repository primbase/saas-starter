'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    User,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    FileText,
    BarChart3,
    Calendar,
    Sparkles,
    Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

interface SidebarProps {
    collapsed: boolean
    onCollapsedChange: (collapsed: boolean) => void
}

const mainNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Documents', href: '/documents', icon: FileText },
    { label: 'Calendar', href: '/calendar', icon: Calendar },
    { label: 'Notifications', href: '/notifications', icon: Bell },
]

const bottomNavItems = [
    { label: 'Profile', href: '/settings/profile', icon: User },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Help & Docs', href: '/help', icon: HelpCircle },
]

export function Sidebar({ collapsed, onCollapsedChange }: SidebarProps) {
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard'
        }
        return pathname.startsWith(href)
    }

    const NavItem = ({ item, isBottom = false }: { item: typeof mainNavItems[0]; isBottom?: boolean }) => {
        const active = isActive(item.href)

        const content = (
            <Link
                href={item.href}
                className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    'hover:bg-sidebar-accent group',
                    active && 'bg-primary text-primary-foreground hover:bg-primary/90',
                    !active && 'text-sidebar-foreground',
                    collapsed && 'justify-center px-2'
                )}
            >
                <item.icon className={cn(
                    'h-5 w-5 flex-shrink-0 transition-transform',
                    !active && 'group-hover:scale-110'
                )} />
                {!collapsed && (
                    <span className="text-sm font-medium truncate">{item.label}</span>
                )}
            </Link>
        )

        if (collapsed) {
            return (
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        {content}
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                        {item.label}
                    </TooltipContent>
                </Tooltip>
            )
        }

        return content
    }

    return (
        <TooltipProvider>
            <aside
                className={cn(
                    'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
                    collapsed ? 'w-16' : 'w-60'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className={cn(
                        'flex items-center h-16 px-3 border-b border-sidebar-border',
                        collapsed ? 'justify-center' : 'justify-between'
                    )}>
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-primary-foreground" />
                            </div>
                            {!collapsed && (
                                <span className="font-bold text-lg text-sidebar-foreground">AppTemplate</span>
                            )}
                        </Link>
                    </div>

                    {/* Collapse Button */}
                    <div className={cn(
                        'px-3 py-2',
                        collapsed && 'flex justify-center'
                    )}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onCollapsedChange(!collapsed)}
                            className={cn(
                                'w-full justify-start text-muted-foreground hover:text-foreground',
                                collapsed && 'w-auto justify-center px-2'
                            )}
                        >
                            {collapsed ? (
                                <ChevronRight className="h-4 w-4" />
                            ) : (
                                <>
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    <span className="text-xs">Collapse</span>
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Main Navigation */}
                    <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                        {mainNavItems.map((item) => (
                            <NavItem key={item.href} item={item} />
                        ))}
                    </nav>

                    {/* Bottom Navigation */}
                    <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
                        {bottomNavItems.map((item) => (
                            <NavItem key={item.href} item={item} isBottom />
                        ))}
                        {!collapsed && (
                            <p className="text-[10px] text-muted-foreground text-center mt-4">
                                Version 1.0.0
                            </p>
                        )}
                    </div>
                </div>
            </aside>
        </TooltipProvider>
    )
}
