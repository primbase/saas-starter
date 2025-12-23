'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, Mail, Loader2, Check, X, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { changePasswordSchema, type ChangePasswordData, getPasswordStrength } from '@/lib/validations'
import { useAuth } from '@/hooks/useAuth'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { cn } from '@/lib/utils'

export default function AccountSettingsPage() {
    const { user, updatePassword, signOut } = useAuth()
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    })

    const newPassword = watch('newPassword', '')
    const passwordStrength = getPasswordStrength(newPassword)

    const passwordRequirements = [
        { label: 'At least 8 characters', met: newPassword.length >= 8 },
        { label: 'One uppercase letter', met: /[A-Z]/.test(newPassword) },
        { label: 'One lowercase letter', met: /[a-z]/.test(newPassword) },
        { label: 'One number', met: /[0-9]/.test(newPassword) },
    ]

    const onChangePassword = async (data: ChangePasswordData) => {
        setIsChangingPassword(true)
        try {
            const { error } = await updatePassword(data.newPassword)

            if (error) {
                toast.error(error.message)
                return
            }

            toast.success('Password updated successfully')
            reset()
        } catch (err) {
            toast.error('Failed to update password')
        } finally {
            setIsChangingPassword(false)
        }
    }

    const handleDeleteAccount = async () => {
        setIsDeleting(true)
        try {
            // In a real app, you would call an API to delete the account
            // For now, we just sign out
            toast.success('Account deletion requested. You will be signed out.')
            await signOut()
        } catch (err) {
            toast.error('Failed to delete account')
        } finally {
            setIsDeleting(false)
            setShowDeleteDialog(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Email Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Address
                    </CardTitle>
                    <CardDescription>
                        Manage your account email address
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="font-medium">{user?.email}</span>
                            {user?.email_confirmed_at && (
                                <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                                    <Check className="h-3 w-3 mr-1" />
                                    Verified
                                </Badge>
                            )}
                        </div>
                        <Button variant="outline" disabled>
                            Change Email
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Email changes require verification for security.
                    </p>
                </CardContent>
            </Card>

            {/* Password Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Password
                    </CardTitle>
                    <CardDescription>
                        Update your password to keep your account secure
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    placeholder="Enter current password"
                                    {...register('currentPassword')}
                                    disabled={isChangingPassword}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    {...register('newPassword')}
                                    disabled={isChangingPassword}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>

                            {newPassword && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    'h-full transition-all duration-300',
                                                    passwordStrength === 'weak' && 'w-1/3 bg-destructive',
                                                    passwordStrength === 'medium' && 'w-2/3 bg-yellow-500',
                                                    passwordStrength === 'strong' && 'w-full bg-green-500'
                                                )}
                                            />
                                        </div>
                                        <span className={cn(
                                            'text-xs font-medium capitalize',
                                            passwordStrength === 'weak' && 'text-destructive',
                                            passwordStrength === 'medium' && 'text-yellow-600',
                                            passwordStrength === 'strong' && 'text-green-600'
                                        )}>
                                            {passwordStrength}
                                        </span>
                                    </div>
                                    <ul className="space-y-1">
                                        {passwordRequirements.map((req, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs">
                                                {req.met ? (
                                                    <Check className="h-3 w-3 text-green-500" />
                                                ) : (
                                                    <X className="h-3 w-3 text-muted-foreground" />
                                                )}
                                                <span className={req.met ? 'text-green-600' : 'text-muted-foreground'}>
                                                    {req.label}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {errors.newPassword && (
                                <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    {...register('confirmPassword')}
                                    disabled={isChangingPassword}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button type="submit" disabled={isChangingPassword}>
                            {isChangingPassword ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Password'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Irreversible and destructive actions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg bg-destructive/5">
                        <div>
                            <h4 className="font-medium">Delete Account</h4>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all data. This cannot be undone.
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Account?"
                description="This action is permanent and cannot be undone. All your data will be permanently deleted."
                confirmLabel="Delete Account"
                variant="destructive"
                confirmText="DELETE"
                onConfirm={handleDeleteAccount}
                loading={isDeleting}
            />
        </div>
    )
}
