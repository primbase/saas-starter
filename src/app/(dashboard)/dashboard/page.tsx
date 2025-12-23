'use client'

import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutDashboard, BarChart3, Users, TrendingUp, Zap, Target, Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const stats = [
    { label: 'Total Projects', value: '12', change: '+2', trend: 'up', icon: LayoutDashboard },
    { label: 'Active Users', value: '342', change: '+18%', trend: 'up', icon: Users },
    { label: 'Revenue', value: '$12,480', change: '+8.2%', trend: 'up', icon: TrendingUp },
    { label: 'Conversion Rate', value: '3.2%', change: '-0.4%', trend: 'down', icon: Target },
]

const placeholderWidgets = [
    {
        title: 'Widget Area 1',
        description: 'Analytics data and charts will appear here',
        icon: BarChart3,
        color: 'bg-gradient-to-br from-violet-500 to-purple-600',
    },
    {
        title: 'Widget Area 2',
        description: 'Activity feed and notifications here',
        icon: Zap,
        color: 'bg-gradient-to-br from-amber-500 to-orange-600',
    },
    {
        title: 'Widget Area 3',
        description: 'Calendar events and scheduling',
        icon: Calendar,
        color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    },
    {
        title: 'Widget Area 4',
        description: 'Recent activity timeline',
        icon: Clock,
        color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    },
]

export default function DashboardPage() {
    const { user, profile } = useAuth()

    const displayName = profile?.full_name || user?.user_metadata?.full_name || 'User'

    // Get current date
    const today = new Date()
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    const formattedDate = today.toLocaleDateString('en-US', dateOptions)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">
                        Welcome back, <span className="font-medium text-foreground">{displayName}</span>
                    </p>
                    <p className="text-sm text-muted-foreground hidden sm:block">{formattedDate}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                    <p className={cn(
                                        'text-xs font-medium mt-1',
                                        stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                                    )}>
                                        {stat.change} from last month
                                    </p>
                                </div>
                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <stat.icon className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Placeholder Widgets */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Your Dashboard</h2>
                </div>

                <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <LayoutDashboard className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Your Dashboard is Ready</h3>
                        <p className="text-muted-foreground max-w-md">
                            This is your main dashboard area. Start building your features here.
                            The widgets below are placeholders showing where you can add custom components.
                        </p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {placeholderWidgets.map((widget) => (
                        <Card
                            key={widget.title}
                            className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        'p-2 rounded-lg text-white',
                                        widget.color
                                    )}>
                                        <widget.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{widget.title}</CardTitle>
                                        <CardDescription className="text-sm">{widget.description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-32 bg-muted/30 rounded-lg border-2 border-dashed border-muted flex items-center justify-center">
                                    <p className="text-sm text-muted-foreground">Content goes here</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
