'use client'

import { useState } from 'react'
import {
    Bell,
    MessageSquare,
    Calendar,
    AlertCircle,
    CheckCircle,
    Trash2,
    Check,
    Filter,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface Notification {
    id: string
    type: 'message' | 'event' | 'alert' | 'success'
    title: string
    description: string
    time: string
    date: string
    read: boolean
}

// Mock notifications
const initialNotifications: Notification[] = [
    {
        id: '1',
        type: 'message',
        title: 'New comment on your post',
        description: 'Sarah mentioned you in a comment on the project discussion.',
        time: '5 minutes ago',
        date: 'Today',
        read: false,
    },
    {
        id: '2',
        type: 'event',
        title: 'Team meeting in 30 minutes',
        description: 'Daily standup with the development team. Join via the calendar link.',
        time: '30 minutes ago',
        date: 'Today',
        read: false,
    },
    {
        id: '3',
        type: 'alert',
        title: 'Storage almost full',
        description: 'You have used 90% of your storage quota. Consider upgrading or removing unused files.',
        time: '1 hour ago',
        date: 'Today',
        read: false,
    },
    {
        id: '4',
        type: 'success',
        title: 'Export completed',
        description: 'Your analytics report has been exported successfully and is ready for download.',
        time: '2 hours ago',
        date: 'Today',
        read: true,
    },
    {
        id: '5',
        type: 'message',
        title: 'New project invitation',
        description: 'You have been invited to join the "Design System" project by Alex.',
        time: '3 hours ago',
        date: 'Today',
        read: true,
    },
    {
        id: '6',
        type: 'event',
        title: 'Sprint planning tomorrow',
        description: 'Reminder: Sprint planning session is scheduled for tomorrow at 10 AM.',
        time: '5 hours ago',
        date: 'Yesterday',
        read: true,
    },
    {
        id: '7',
        type: 'success',
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
        time: '1 day ago',
        date: 'Yesterday',
        read: true,
    },
    {
        id: '8',
        type: 'alert',
        title: 'New login from unknown device',
        description: 'We detected a login from a new device. If this wasn\'t you, secure your account.',
        time: '2 days ago',
        date: 'Dec 20',
        read: true,
    },
]

const getIcon = (type: string) => {
    switch (type) {
        case 'message':
            return MessageSquare
        case 'event':
            return Calendar
        case 'alert':
            return AlertCircle
        case 'success':
            return CheckCircle
        default:
            return Bell
    }
}

const getColor = (type: string) => {
    switch (type) {
        case 'message':
            return 'text-blue-500 bg-blue-500/10'
        case 'event':
            return 'text-violet-500 bg-violet-500/10'
        case 'alert':
            return 'text-amber-500 bg-amber-500/10'
        case 'success':
            return 'text-emerald-500 bg-emerald-500/10'
        default:
            return 'text-gray-500 bg-gray-500/10'
    }
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(initialNotifications)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    const unreadCount = notifications.filter(n => !n.read).length
    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications

    // Group by date
    const groupedNotifications = filteredNotifications.reduce((acc, notification) => {
        if (!acc[notification.date]) {
            acc[notification.date] = []
        }
        acc[notification.date].push(notification)
        return acc
    }, {} as Record<string, Notification[]>)

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    const clearAll = () => {
        setNotifications([])
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                    <p className="text-muted-foreground">
                        Stay updated with your latest activities and alerts.
                    </p>
                </div>
                <div className="flex gap-2">
                    {unreadCount > 0 && (
                        <Button variant="outline" onClick={markAllAsRead}>
                            <Check className="h-4 w-4 mr-2" />
                            Mark all as read
                        </Button>
                    )}
                    {notifications.length > 0 && (
                        <Button variant="outline" onClick={clearAll}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear all
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold">{notifications.length}</p>
                        <p className="text-sm text-muted-foreground">Total</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-primary">{unreadCount}</p>
                        <p className="text-sm text-muted-foreground">Unread</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-500">
                            {notifications.filter(n => n.type === 'message').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Messages</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-amber-500">
                            {notifications.filter(n => n.type === 'alert').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Alerts</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Tabs */}
            <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">
                        Unread
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {unreadCount}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="mt-4">
                    {Object.keys(groupedNotifications).length > 0 ? (
                        <div className="space-y-6">
                            {Object.entries(groupedNotifications).map(([date, items]) => (
                                <div key={date}>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                                        {date}
                                    </h3>
                                    <div className="space-y-2">
                                        {items.map((notification) => {
                                            const Icon = getIcon(notification.type)
                                            return (
                                                <Card
                                                    key={notification.id}
                                                    className={cn(
                                                        'cursor-pointer transition-colors hover:bg-muted/50',
                                                        !notification.read && 'border-l-4 border-l-primary'
                                                    )}
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex gap-4">
                                                            <div className={cn('p-2 rounded-lg h-fit', getColor(notification.type))}>
                                                                <Icon className="h-5 w-5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <p className={cn(
                                                                        'text-sm',
                                                                        !notification.read && 'font-semibold'
                                                                    )}>
                                                                        {notification.title}
                                                                    </p>
                                                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                                        {notification.time}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    {notification.description}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <Badge variant="secondary" className="text-xs capitalize">
                                                                        {notification.type}
                                                                    </Badge>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-auto py-1 px-2 text-xs"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            deleteNotification(notification.id)
                                                                        }}
                                                                    >
                                                                        <Trash2 className="h-3 w-3 mr-1" />
                                                                        Delete
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <div className="p-4 bg-muted rounded-full mb-4">
                                    <Bell className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="font-semibold mb-1">No notifications</h3>
                                <p className="text-sm text-muted-foreground text-center">
                                    {filter === 'unread'
                                        ? "You've read all your notifications!"
                                        : "You don't have any notifications yet."}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
