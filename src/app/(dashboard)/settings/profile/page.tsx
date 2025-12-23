'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Loader2, X, User } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { profileSchema, type ProfileFormData } from '@/lib/validations'
import { useAuth } from '@/hooks/useAuth'
import { uploadAvatar, deleteAvatar, updateProfile as updateProfileFn } from '@/lib/supabase'

export default function ProfileSettingsPage() {
    const { user, profile, refreshProfile } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const displayName = profile?.full_name || user?.user_metadata?.full_name || ''
    const initials = displayName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: profile?.full_name || user?.user_metadata?.full_name || '',
            bio: profile?.bio || '',
            location: profile?.location || '',
            website: profile?.website || '',
        },
    })

    const onSubmit = async (data: ProfileFormData) => {
        if (!user) {
            toast.error('You must be logged in to update your profile')
            return
        }

        setIsLoading(true)
        try {
            const { error } = await updateProfileFn(user.id, {
                full_name: data.fullName,
                bio: data.bio || null,
                location: data.location || null,
                website: data.website || null,
            })

            if (error) {
                toast.error('Failed to update profile')
                return
            }

            await refreshProfile()
            reset(data)
            toast.success('Profile updated successfully')
        } catch (err) {
            toast.error('An error occurred while updating your profile')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user) return

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            toast.error('Please upload a JPG, PNG, or GIF image')
            return
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB')
            return
        }

        setIsUploadingAvatar(true)
        try {
            const { data: avatarUrl, error: uploadError } = await uploadAvatar(user.id, file)

            if (uploadError || !avatarUrl) {
                toast.error('Failed to upload avatar')
                return
            }

            // Update profile with new avatar URL
            const { error: updateError } = await updateProfileFn(user.id, {
                avatar_url: avatarUrl,
            })

            if (updateError) {
                toast.error('Failed to update profile with new avatar')
                return
            }

            await refreshProfile()
            toast.success('Avatar updated successfully')
        } catch (err) {
            toast.error('An error occurred while uploading your avatar')
        } finally {
            setIsUploadingAvatar(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleRemoveAvatar = async () => {
        if (!user) return

        setIsUploadingAvatar(true)
        try {
            const { error: deleteError } = await deleteAvatar(user.id)

            if (deleteError) {
                toast.error('Failed to remove avatar')
                return
            }

            const { error: updateError } = await updateProfileFn(user.id, {
                avatar_url: null,
            })

            if (updateError) {
                toast.error('Failed to update profile')
                return
            }

            await refreshProfile()
            toast.success('Avatar removed')
        } catch (err) {
            toast.error('An error occurred while removing your avatar')
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Avatar Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>
                        Upload a picture to personalize your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                    {initials || <User className="h-10 w-10" />}
                                </AvatarFallback>
                            </Avatar>
                            {isUploadingAvatar && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingAvatar}
                                >
                                    <Camera className="h-4 w-4 mr-2" />
                                    Upload
                                </Button>
                                {profile?.avatar_url && (
                                    <Button
                                        variant="ghost"
                                        onClick={handleRemoveAvatar}
                                        disabled={isUploadingAvatar}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Remove
                                    </Button>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                JPG, PNG or GIF. Max 5MB.
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/gif"
                                onChange={handleAvatarUpload}
                                className="hidden"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                        Update your personal information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                                id="fullName"
                                placeholder="John Doe"
                                {...register('fullName')}
                                disabled={isLoading}
                            />
                            {errors.fullName && (
                                <p className="text-sm text-destructive">{errors.fullName.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell us about yourself..."
                                rows={4}
                                {...register('bio')}
                                disabled={isLoading}
                            />
                            <p className="text-xs text-muted-foreground">
                                {(register('bio').name && 500)} characters max
                            </p>
                            {errors.bio && (
                                <p className="text-sm text-destructive">{errors.bio.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="City, Country"
                                    {...register('location')}
                                    disabled={isLoading}
                                />
                                {errors.location && (
                                    <p className="text-sm text-destructive">{errors.location.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    type="url"
                                    placeholder="https://yourwebsite.com"
                                    {...register('website')}
                                    disabled={isLoading}
                                />
                                {errors.website && (
                                    <p className="text-sm text-destructive">{errors.website.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => reset()}
                                disabled={isLoading || !isDirty}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading || !isDirty}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
