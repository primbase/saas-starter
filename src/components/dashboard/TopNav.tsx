'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Menu,
    Search,
    Bell,
    Sun,
    Moon,
    User,
    Settings,
    LogOut,
    ChevronDown,
    MessageSquare,
    Calendar,
    AlertCircle,
    CheckCircle,
    X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'

interface TopNavProps {
    sidebarCollapsed: boolean
    onMenuClick: () => void
    isMobile: boolean
    onSearchClick?: () => void
}

// Mock notifications data
const mockNotifications = [
    {
        id: '1',
        type: 'message',
        title: 'New comment on your post',
        description: 'Sarah mentioned you in a comment',
        time: '5 minutes ago',
        read: false,
        icon: MessageSquare,
        color: 'text-blue-500',
    },
    {
        id: '2',
        type: 'event',
        title: 'Team meeting in 30 minutes',
        description: 'Daily standup with the development team',
        time: '30 minutes ago',
        read: false,
        icon: Calendar,
        color: 'text-violet-500',
    },
    {
        id: '3',
        type: 'alert',
        title: 'Storage almost full',
        description: 'You have used 90% of your storage quota',
        time: '1 hour ago',
        read: false,
        icon: AlertCircle,
        color: 'text-amber-500',
    },
    {
        id: '4',
        type: 'success',
        title: 'Export completed',
        description: 'Your report has been exported successfully',
        time: '2 hours ago',
        read: true,
        icon: CheckCircle,
        color: 'text-emerald-500',
    },
    {
        id: '5',
        type: 'message',
        title: 'New project invitation',
        description: 'You have been invited to join "Design System"',
        time: '3 hours ago',
        read: true,
        icon: MessageSquare,
        color: 'text-blue-500',
    },
]

export function TopNav({ sidebarCollapsed, onMenuClick, isMobile, onSearchClick }: TopNavProps) {
    const router = useRouter()
    const { resolvedTheme, setTheme } = useTheme()
    const { user, profile, signOut } = useAuth()
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [notifications, setNotifications] = useState(mockNotifications)
    const [notificationsOpen, setNotificationsOpen] = useState(false)

    const unreadCount = notifications.filter(n => !n.read).length

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await signOut()
            router.push('/login')
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            setIsLoggingOut(false)
        }
    }

    const toggleTheme = () => {
        if (resolvedTheme === 'dark') {
            setTheme('light')
        } else {
            setTheme('dark')
        }
    }

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }

    const clearNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    const displayName = profile?.full_name || user?.user_metadata?.full_name || 'User'
    const email = user?.email || ''
    const initials = displayName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <header
            className={cn(
                'fixed top-0 right-0 z-30 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border transition-all duration-300',
                isMobile ? 'left-0' : sidebarCollapsed ? 'left-16' : 'left-60'
            )}
        >
            <div className="flex items-center justify-between h-full px-4 sm:px-6">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    {isMobile && (
                        <Button variant="ghost" size="icon" onClick={onMenuClick}>
                            <Menu className="h-5 w-5" />
                        </Button>
                    )}

                    {/* Search */}
                    <button
                        onClick={onSearchClick}
                        className="hidden sm:flex relative items-center w-64 lg:w-80 h-9 px-3 bg-muted/50 rounded-md border border-input text-sm text-muted-foreground hover:bg-muted transition-colors"
                    >
                        <Search className="h-4 w-4 mr-2" />
                        <span>Search...</span>
                        <kbd className="absolute right-3 pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                            ⌘K
                        </kbd>
                    </button>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    {/* Mobile search */}
                    <Button variant="ghost" size="icon" className="sm:hidden" onClick={onSearchClick}>
                        <Search className="h-5 w-5" />
                    </Button>

                    {/* Notifications */}
                    <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-destructive rounded-full text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-80 p-0">
                            <div className="flex items-center justify-between px-4 py-3 border-b">
                                <h3 className="font-semibold">Notifications</h3>
                                {unreadCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs h-auto py-1"
                                        onClick={markAllAsRead}
                                    >
                                        Mark all as read
                                    </Button>
                                )}
                            </div>
                            <ScrollArea className="h-[300px]">
                                {notifications.length > 0 ? (
                                    <div className="divide-y">
                                        {notifications.map((notification) => {
                                            const Icon = notification.icon
                                            return (
                                                <div
                                                    key={notification.id}
                                                    className={cn(
                                                        'flex gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors relative group',
                                                        !notification.read && 'bg-primary/5'
                                                    )}
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    <div className={cn('p-2 rounded-full bg-muted', notification.color)}>
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={cn(
                                                            'text-sm truncate',
                                                            !notification.read && 'font-medium'
                                                        )}>
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {notification.description}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            clearNotification(notification.id)
                                                        }}
                                                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                    {!notification.read && (
                                                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                                        <p className="text-sm font-medium">No notifications</p>
                                        <p className="text-xs text-muted-foreground">
                                            You&apos;re all caught up!
                                        </p>
                                    </div>
                                )}
                            </ScrollArea>
                            <div className="border-t p-2">
                                <Button
                                    variant="ghost"
                                    className="w-full text-sm"
                                    onClick={() => {
                                        setNotificationsOpen(false)
                                        router.push('/notifications')
                                    }}
                                >
                                    View all notifications
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Theme toggle */}
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        {resolvedTheme === 'dark' ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>

                    {/* Profile dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 px-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden md:flex flex-col items-start">
                                    <span className="text-sm font-medium">{displayName}</span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">{displayName}</p>
                                    <p className="text-xs text-muted-foreground truncate">{email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/settings/profile" className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    View Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/settings" className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="text-destructive focus:text-destructive cursor-pointer"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                {isLoggingOut ? 'Logging out...' : 'Log out'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
