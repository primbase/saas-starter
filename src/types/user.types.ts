import type { User } from '@supabase/supabase-js'
import type { Profile } from './database.types'

/**
 * Extended user type combining Supabase auth user with profile data
 */
export interface AppUser extends Omit<User, 'user_metadata'> {
    profile: Profile | null
    user_metadata: User['user_metadata'] & {
        full_name?: string
        avatar_url?: string
    }
}

/**
 * Auth context state
 */
export interface AuthState {
    user: AppUser | null
    profile: Profile | null
    isLoading: boolean
    isAuthenticated: boolean
}

/**
 * Auth context actions
 */
export interface AuthActions {
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>
    signOut: () => Promise<void>
    resetPassword: (email: string) => Promise<{ error: Error | null }>
    updatePassword: (newPassword: string) => Promise<{ error: Error | null }>
    updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>
    refreshProfile: () => Promise<void>
}

/**
 * Full auth context type
 */
export type AuthContextType = AuthState & AuthActions

/**
 * Email notification preferences
 */
export interface EmailNotifications {
    accountUpdates: boolean
    securityAlerts: boolean
    newsletter: boolean
    productUpdates: boolean
}

/**
 * User preferences stored in profile
 */
export interface UserPreferences {
    theme: 'light' | 'dark' | 'system'
    sidebarCollapsed: boolean
    emailNotifications: EmailNotifications
}
