'use client'

import { useState } from 'react'
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    Eye,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Mock analytics data
const overviewStats = [
    { label: 'Total Visitors', value: '24,532', change: '+12.5%', trend: 'up', icon: Users },
    { label: 'Page Views', value: '89,234', change: '+8.2%', trend: 'up', icon: Eye },
    { label: 'Avg. Session', value: '4m 32s', change: '-2.1%', trend: 'down', icon: Clock },
    { label: 'Bounce Rate', value: '32.1%', change: '-5.4%', trend: 'up', icon: BarChart3 },
]

const weeklyData = [
    { day: 'Mon', visitors: 1200, pageViews: 4500 },
    { day: 'Tue', visitors: 1800, pageViews: 6200 },
    { day: 'Wed', visitors: 1400, pageViews: 5100 },
    { day: 'Thu', visitors: 2100, pageViews: 7800 },
    { day: 'Fri', visitors: 1900, pageViews: 6900 },
    { day: 'Sat', visitors: 800, pageViews: 2800 },
    { day: 'Sun', visitors: 600, pageViews: 2100 },
]

const topPages = [
    { path: '/dashboard', views: 12453, percentage: 28 },
    { path: '/settings/profile', views: 8234, percentage: 18 },
    { path: '/analytics', views: 6123, percentage: 14 },
    { path: '/documents', views: 4532, percentage: 10 },
    { path: '/calendar', views: 3421, percentage: 8 },
]

const trafficSources = [
    { source: 'Direct', visitors: 8532, color: 'bg-violet-500' },
    { source: 'Google', visitors: 6234, color: 'bg-blue-500' },
    { source: 'Social', visitors: 4123, color: 'bg-pink-500' },
    { source: 'Referral', visitors: 2845, color: 'bg-amber-500' },
    { source: 'Email', visitors: 1532, color: 'bg-emerald-500' },
]

export default function AnalyticsPage() {
    const maxVisitors = Math.max(...weeklyData.map(d => d.visitors))
    const totalTraffic = trafficSources.reduce((sum, s) => sum + s.visitors, 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">
                    Track your application performance and user engagement.
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {overviewStats.map((stat) => (
                    <Card key={stat.label} className="relative overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                    <div className={cn(
                                        'flex items-center gap-1 text-xs font-medium mt-1',
                                        stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                                    )}>
                                        {stat.trend === 'up' ? (
                                            <ArrowUpRight className="h-3 w-3" />
                                        ) : (
                                            <ArrowDownRight className="h-3 w-3" />
                                        )}
                                        {stat.change}
                                    </div>
                                </div>
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <stat.icon className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Visitors Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Visitors</CardTitle>
                        <CardDescription>Visitor count for the past 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between h-48 gap-2">
                            {weeklyData.map((data) => (
                                <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                                    <div
                                        className="w-full bg-primary/80 rounded-t-sm transition-all hover:bg-primary"
                                        style={{ height: `${(data.visitors / maxVisitors) * 100}%` }}
                                    />
                                    <span className="text-xs text-muted-foreground">{data.day}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Traffic Sources */}
                <Card>
                    <CardHeader>
                        <CardTitle>Traffic Sources</CardTitle>
                        <CardDescription>Where your visitors come from</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {trafficSources.map((source) => (
                                <div key={source.source} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{source.source}</span>
                                        <span className="text-muted-foreground">
                                            {source.visitors.toLocaleString()} ({Math.round((source.visitors / totalTraffic) * 100)}%)
                                        </span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={cn('h-full rounded-full transition-all', source.color)}
                                            style={{ width: `${(source.visitors / totalTraffic) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Pages */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Pages</CardTitle>
                    <CardDescription>Most visited pages in your application</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {topPages.map((page, index) => (
                            <div key={page.path} className="flex items-center gap-4">
                                <span className="text-sm font-medium text-muted-foreground w-6">
                                    {index + 1}
                                </span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                                            {page.path}
                                        </code>
                                        <span className="text-sm text-muted-foreground">
                                            {page.views.toLocaleString()} views
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full"
                                            style={{ width: `${page.percentage * 2}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
