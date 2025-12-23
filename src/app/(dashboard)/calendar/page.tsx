'use client'

import { useState } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    MapPin,
    Users,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CalendarEvent {
    id: string
    title: string
    time: string
    duration: string
    type: 'meeting' | 'reminder' | 'task' | 'event'
    location?: string
    attendees?: number
}

// Get current date info
const today = new Date()
const currentMonth = today.toLocaleString('default', { month: 'long' })
const currentYear = today.getFullYear()

// Generate calendar days
const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
}

// Mock events data
const mockEvents: Record<number, CalendarEvent[]> = {
    [today.getDate()]: [
        { id: '1', title: 'Team Standup', time: '9:00 AM', duration: '30 min', type: 'meeting', attendees: 8 },
        { id: '2', title: 'Project Review', time: '2:00 PM', duration: '1 hour', type: 'meeting', location: 'Conference Room A', attendees: 5 },
    ],
    [today.getDate() + 1]: [
        { id: '3', title: 'Client Presentation', time: '10:00 AM', duration: '2 hours', type: 'event', location: 'Main Hall', attendees: 15 },
    ],
    [today.getDate() + 3]: [
        { id: '4', title: 'Design Review', time: '11:00 AM', duration: '1 hour', type: 'meeting', attendees: 4 },
        { id: '5', title: 'Submit Report', time: '5:00 PM', duration: '—', type: 'task' },
    ],
    [today.getDate() + 5]: [
        { id: '6', title: 'Team Building', time: '3:00 PM', duration: '3 hours', type: 'event', location: 'Rooftop', attendees: 20 },
    ],
    [today.getDate() - 2]: [
        { id: '7', title: 'Sprint Planning', time: '10:00 AM', duration: '2 hours', type: 'meeting', attendees: 6 },
    ],
}

const eventTypeColors: Record<string, string> = {
    meeting: 'bg-blue-500',
    reminder: 'bg-amber-500',
    task: 'bg-emerald-500',
    event: 'bg-violet-500',
}

export default function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState(today.getDate())
    const [currentMonthIndex, setCurrentMonthIndex] = useState(today.getMonth())

    const daysInMonth = getDaysInMonth(currentYear, currentMonthIndex)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonthIndex)
    const displayMonth = new Date(currentYear, currentMonthIndex).toLocaleString('default', { month: 'long' })

    const days = []
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i)
    }

    const selectedDateEvents = mockEvents[selectedDate] || []

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
                    <p className="text-muted-foreground">
                        Manage your schedule and events.
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Event
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Grid */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle>{displayMonth} {currentYear}</CardTitle>
                            <div className="flex gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentMonthIndex(prev => prev - 1)}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentMonthIndex(prev => prev + 1)}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Week day headers */}
                        <div className="grid grid-cols-7 mb-2">
                            {weekDays.map((day) => (
                                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((day, index) => {
                                const hasEvents = day && mockEvents[day]
                                const isToday = day === today.getDate() && currentMonthIndex === today.getMonth()
                                const isSelected = day === selectedDate && currentMonthIndex === today.getMonth()

                                return (
                                    <button
                                        key={index}
                                        disabled={!day}
                                        onClick={() => day && setSelectedDate(day)}
                                        className={cn(
                                            'aspect-square p-1 rounded-lg text-sm transition-colors relative',
                                            day && 'hover:bg-muted cursor-pointer',
                                            isToday && 'bg-primary/10 font-bold',
                                            isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                                            !day && 'cursor-default'
                                        )}
                                    >
                                        {day}
                                        {hasEvents && !isSelected && (
                                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                                {mockEvents[day].slice(0, 3).map((event, i) => (
                                                    <div
                                                        key={i}
                                                        className={cn('w-1.5 h-1.5 rounded-full', eventTypeColors[event.type])}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Events for Selected Date */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {selectedDate === today.getDate() ? 'Today' : `${displayMonth} ${selectedDate}`}
                        </CardTitle>
                        <CardDescription>
                            {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''} scheduled
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {selectedDateEvents.length > 0 ? (
                            <div className="space-y-4">
                                {selectedDateEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                                    >
                                        <div className={cn('w-1 rounded-full', eventTypeColors[event.type])} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{event.title}</p>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {event.time} • {event.duration}
                                                </span>
                                            </div>
                                            {event.location && (
                                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                                    <MapPin className="h-3 w-3" />
                                                    {event.location}
                                                </div>
                                            )}
                                            {event.attendees && (
                                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                                    <Users className="h-3 w-3" />
                                                    {event.attendees} attendees
                                                </div>
                                            )}
                                            <Badge
                                                variant="secondary"
                                                className={cn(
                                                    'mt-2 text-[10px] capitalize',
                                                    event.type === 'meeting' && 'bg-blue-500/10 text-blue-600',
                                                    event.type === 'task' && 'bg-emerald-500/10 text-emerald-600',
                                                    event.type === 'event' && 'bg-violet-500/10 text-violet-600'
                                                )}
                                            >
                                                {event.type}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="p-3 bg-muted rounded-full mb-3">
                                    <Clock className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="font-medium">No events</p>
                                <p className="text-sm text-muted-foreground">
                                    Nothing scheduled for this day
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Events */}
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Your schedule for the next few days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(mockEvents)
                            .filter(([day]) => parseInt(day) >= today.getDate())
                            .sort(([a], [b]) => parseInt(a) - parseInt(b))
                            .slice(0, 5)
                            .map(([day, events]) => (
                                <div key={day} className="flex gap-4">
                                    <div className="w-16 flex-shrink-0 text-center">
                                        <p className="text-2xl font-bold">{day}</p>
                                        <p className="text-xs text-muted-foreground">{displayMonth.slice(0, 3)}</p>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        {events.map((event) => (
                                            <div
                                                key={event.id}
                                                className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                                            >
                                                <div className={cn('w-2 h-2 rounded-full', eventTypeColors[event.type])} />
                                                <span className="font-medium text-sm">{event.title}</span>
                                                <span className="text-xs text-muted-foreground">{event.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
