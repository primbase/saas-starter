'use client'

import { useState } from 'react'
import { Sun, Moon, Monitor, Bell, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun, description: 'Light background with dark text' },
    { value: 'dark' as const, label: 'Dark', icon: Moon, description: 'Dark background with light text' },
    { value: 'system' as const, label: 'System', icon: Monitor, description: 'Follow system preferences' },
]

const notificationSettings = [
    { key: 'accountUpdates', label: 'Account Updates', description: 'Get notified about account-related changes' },
    { key: 'securityAlerts', label: 'Security Alerts', description: 'Receive alerts about security issues' },
    { key: 'newsletter', label: 'Newsletter', description: 'Receive our weekly newsletter' },
    { key: 'productUpdates', label: 'Product Updates', description: 'Get updates about new features' },
]

export default function PreferencesSettingsPage() {
    const { theme, setTheme } = useTheme()
    const { profile, updateProfile } = useAuth()
    const [isSaving, setIsSaving] = useState(false)
    const [notifications, setNotifications] = useState<Record<string, boolean>>({
        accountUpdates: true,
        securityAlerts: true,
        newsletter: false,
        productUpdates: true,
        ...((profile?.email_notifications as Record<string, boolean>) || {}),
    })

    const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme)

        // Optionally save to profile
        try {
            await updateProfile({ theme_preference: newTheme })
        } catch (err) {
            // Theme is already changed locally, profile update is optional
        }
    }

    const handleNotificationChange = async (key: string, checked: boolean) => {
        const newNotifications = { ...notifications, [key]: checked }
        setNotifications(newNotifications)

        try {
            await updateProfile({ email_notifications: newNotifications })
            toast.success('Preferences saved')
        } catch (err) {
            // Revert on error
            setNotifications(notifications)
            toast.error('Failed to save preferences')
        }
    }

    return (
        <div className="space-y-6">
            {/* Theme Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                        Customize how the application looks on your device
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {themeOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleThemeChange(option.value)}
                                className={cn(
                                    'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                                    'hover:border-primary/50',
                                    theme === option.value
                                        ? 'border-primary bg-primary/5'
                                        : 'border-muted'
                                )}
                            >
                                <div className={cn(
                                    'p-3 rounded-full',
                                    theme === option.value ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                )}>
                                    <option.icon className="h-5 w-5" />
                                </div>
                                <span className="font-medium">{option.label}</span>
                                <span className="text-xs text-muted-foreground text-center">
                                    {option.description}
                                </span>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Email Notifications
                    </CardTitle>
                    <CardDescription>
                        Choose what email notifications you want to receive
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {notificationSettings.map((setting) => (
                            <div
                                key={setting.key}
                                className="flex items-center justify-between py-3 border-b last:border-b-0"
                            >
                                <div className="space-y-0.5">
                                    <Label htmlFor={setting.key} className="text-base cursor-pointer">
                                        {setting.label}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        {setting.description}
                                    </p>
                                </div>
                                <Switch
                                    id={setting.key}
                                    checked={notifications[setting.key]}
                                    onCheckedChange={(checked) => handleNotificationChange(setting.key, checked)}
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Push Notifications (Placeholder) */}
            <Card>
                <CardHeader>
                    <CardTitle>Push Notifications</CardTitle>
                    <CardDescription>
                        Get real-time notifications in your browser
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Enable Browser Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive notifications even when you&apos;re not on the site
                            </p>
                        </div>
                        <Switch disabled />
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                        Push notifications require browser permission.
                    </p>
                </CardContent>
            </Card>

            {/* Sidebar Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle>Display</CardTitle>
                    <CardDescription>
                        Customize your dashboard display preferences
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b">
                            <div className="space-y-0.5">
                                <Label className="text-base">Remember Sidebar State</Label>
                                <p className="text-sm text-muted-foreground">
                                    Keep sidebar collapsed or expanded between sessions
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div className="space-y-0.5">
                                <Label className="text-base">Compact Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                    Reduce spacing and show more content
                                </p>
                            </div>
                            <Switch />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
