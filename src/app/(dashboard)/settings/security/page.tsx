'use client'

import { Shield, Monitor, MapPin, Clock, Smartphone, Globe, Lock, Key } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

// Mock session data for UI demonstration
const mockSessions = [
    {
        id: '1',
        device: 'MacBook Pro',
        browser: 'Chrome 120',
        location: 'San Francisco, US',
        ip: '192.168.1.xxx',
        lastActive: 'Now',
        isCurrent: true,
    },
    {
        id: '2',
        device: 'iPhone 15',
        browser: 'Safari Mobile',
        location: 'San Francisco, US',
        ip: '192.168.1.xxx',
        lastActive: '2 hours ago',
        isCurrent: false,
    },
]

const mockLoginHistory = [
    { date: '2024-12-22 10:30 AM', device: 'MacBook Pro', location: 'San Francisco, US', status: 'Success' },
    { date: '2024-12-21 08:15 PM', device: 'iPhone 15', location: 'San Francisco, US', status: 'Success' },
    { date: '2024-12-20 09:00 AM', device: 'MacBook Pro', location: 'San Francisco, US', status: 'Success' },
    { date: '2024-12-19 11:45 AM', device: 'Unknown Device', location: 'New York, US', status: 'Failed' },
]

export default function SecuritySettingsPage() {
    const { user } = useAuth()

    return (
        <div className="space-y-6">
            {/* Current Session */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Monitor className="h-5 w-5" />
                        Current Session
                    </CardTitle>
                    <CardDescription>
                        Information about your current login session
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Monitor className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">MacBook Pro</span>
                                    <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                                        This device
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">Chrome 120 on macOS</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        San Francisco, US
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Active now
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Smartphone className="h-5 w-5" />
                                Active Sessions
                            </CardTitle>
                            <CardDescription>
                                Devices where you&apos;re currently logged in
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            Revoke All Others
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {mockSessions.map((session) => (
                            <div
                                key={session.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-muted rounded-lg">
                                        {session.device.includes('iPhone') ? (
                                            <Smartphone className="h-5 w-5" />
                                        ) : (
                                            <Monitor className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">{session.device}</span>
                                            {session.isCurrent && (
                                                <Badge variant="secondary" className="text-xs">Current</Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {session.browser} • {session.location}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Last active: {session.lastActive}
                                        </p>
                                    </div>
                                </div>
                                {!session.isCurrent && (
                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                        Revoke
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Login History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Login History
                    </CardTitle>
                    <CardDescription>
                        Recent login attempts to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Date</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Device</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Location</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockLoginHistory.map((entry, i) => (
                                    <tr key={i} className="border-b last:border-b-0">
                                        <td className="py-3 px-2 text-sm">{entry.date}</td>
                                        <td className="py-3 px-2 text-sm">{entry.device}</td>
                                        <td className="py-3 px-2 text-sm">{entry.location}</td>
                                        <td className="py-3 px-2">
                                            <Badge
                                                variant={entry.status === 'Success' ? 'secondary' : 'destructive'}
                                                className={entry.status === 'Success' ? 'bg-green-500/10 text-green-600' : ''}
                                            >
                                                {entry.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Two-Factor Authentication
                        <Badge variant="secondary" className="ml-2">Coming Soon</Badge>
                    </CardTitle>
                    <CardDescription>
                        Add an extra layer of security to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-muted rounded-lg">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-medium">Enhance your security</p>
                                <p className="text-sm text-muted-foreground">
                                    Two-factor authentication adds an extra layer of protection to your account
                                </p>
                            </div>
                        </div>
                        <Button disabled>
                            Enable 2FA
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Connected Apps */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Connected Applications
                    </CardTitle>
                    <CardDescription>
                        Third-party applications connected to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="p-3 bg-muted rounded-full mb-4">
                            <Lock className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="font-medium">No connected applications</p>
                        <p className="text-sm text-muted-foreground">
                            You haven&apos;t connected any third-party applications yet
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
