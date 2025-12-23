'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { MobileSidebar } from './MobileSidebar'
import { CommandPalette, useCommandPalette } from './CommandPalette'
import { useIsMobile } from '@/hooks/useMediaQuery'

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const isMobile = useIsMobile()
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const { open: commandOpen, setOpen: setCommandOpen } = useCommandPalette()

    // Load sidebar state from localStorage
    useEffect(() => {
        setMounted(true)
        const saved = localStorage.getItem('sidebar-collapsed')
        if (saved !== null) {
            setSidebarCollapsed(JSON.parse(saved))
        }
    }, [])

    // Save sidebar state to localStorage
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('sidebar-collapsed', JSON.stringify(sidebarCollapsed))
        }
    }, [sidebarCollapsed, mounted])

    // Close mobile sidebar on route change or resize
    useEffect(() => {
        if (!isMobile) {
            setMobileSidebarOpen(false)
        }
    }, [isMobile])

    // Prevent flash before mounted
    if (!mounted) {
        return (
            <div className="min-h-screen bg-background">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-pulse text-muted-foreground">Loading...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Command Palette */}
            <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

            {/* Desktop Sidebar */}
            {!isMobile && (
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onCollapsedChange={setSidebarCollapsed}
                />
            )}

            {/* Mobile Sidebar */}
            <MobileSidebar
                open={mobileSidebarOpen}
                onOpenChange={setMobileSidebarOpen}
            />

            {/* Top Navigation */}
            <TopNav
                sidebarCollapsed={sidebarCollapsed}
                onMenuClick={() => setMobileSidebarOpen(true)}
                isMobile={isMobile}
                onSearchClick={() => setCommandOpen(true)}
            />

            {/* Main Content */}
            <main
                className={cn(
                    'min-h-screen pt-16 transition-all duration-300',
                    isMobile ? 'pl-0' : sidebarCollapsed ? 'pl-16' : 'pl-60'
                )}
            >
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
