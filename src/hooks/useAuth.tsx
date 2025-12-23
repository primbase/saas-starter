'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, getProfile, updateProfile as updateProfileFn } from '@/lib/supabase'
import type { Profile } from '@/types/database.types'

/**
 * DEMO MODE TOGGLE
 * Set to true to bypass authentication and use mock user data for UI preview.
 * Set to false to require real Supabase authentication.
 * See: .agent/workflows/demo-mode.md for more details.
 */
const DEMO_MODE = true

// Mock data for demo mode
const DEMO_USER: User = {
    id: 'demo-user-id',
    email: 'demo@example.com',
    aud: 'authenticated',
    role: 'authenticated',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {
        full_name: 'Demo User',
    },
} as User

const DEMO_PROFILE: Profile = {
    id: 'demo-user-id',
    full_name: 'Demo User',
    avatar_url: null,
    bio: 'This is a demo account for UI preview purposes.',
    location: 'San Francisco, CA',
    website: 'https://example.com',
    theme_preference: 'system',
    sidebar_collapsed: false,
    email_notifications: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
}

const DEMO_SESSION: Session = {
    access_token: 'demo-token',
    refresh_token: 'demo-refresh-token',
    expires_in: 3600,
    expires_at: Date.now() / 1000 + 3600,
    token_type: 'bearer',
    user: DEMO_USER,
} as Session

interface AuthContextType {
    user: User | null
    profile: Profile | null
    session: Session | null
    isLoading: boolean
    isAuthenticated: boolean
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null; needsVerification: boolean }>
    signOut: () => Promise<void>
    resetPassword: (email: string) => Promise<{ error: Error | null }>
    updatePassword: (newPassword: string) => Promise<{ error: Error | null }>
    updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>
    refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(DEMO_MODE ? DEMO_USER : null)
    const [profile, setProfile] = useState<Profile | null>(DEMO_MODE ? DEMO_PROFILE : null)
    const [session, setSession] = useState<Session | null>(DEMO_MODE ? DEMO_SESSION : null)
    const [isLoading, setIsLoading] = useState(!DEMO_MODE)

    const refreshProfile = useCallback(async () => {
        if (DEMO_MODE) {
            setProfile(DEMO_PROFILE)
            return
        }
        if (!user) {
            setProfile(null)
            return
        }
        try {
            const { data, error } = await getProfile(user.id)
            if (error) {
                console.error('Error fetching profile:', error)
                setProfile(null)
            } else {
                setProfile(data)
            }
        } catch (err) {
            console.error('Error refreshing profile:', err)
        }
    }, [user])

    useEffect(() => {
        if (DEMO_MODE) {
            // In demo mode, skip real auth initialization
            setIsLoading(false)
            return
        }

        // Get initial session
        const initializeAuth = async () => {
            try {
                const { data: { session: initialSession } } = await supabase.auth.getSession()
                setSession(initialSession)
                setUser(initialSession?.user ?? null)

                if (initialSession?.user) {
                    const { data } = await getProfile(initialSession.user.id)
                    setProfile(data)
                }
            } catch (error) {
                console.error('Error initializing auth:', error)
            } finally {
                setIsLoading(false)
            }
        }

        initializeAuth()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
                setSession(newSession)
                setUser(newSession?.user ?? null)

                if (newSession?.user) {
                    const { data } = await getProfile(newSession.user.id)
                    setProfile(data)
                } else {
                    setProfile(null)
                }

                if (event === 'SIGNED_OUT') {
                    setProfile(null)
                }
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const signIn = async (email: string, password: string) => {
        if (DEMO_MODE) {
            return { error: new Error('Demo mode: Sign in disabled. Disable demo mode to use real authentication.') }
        }
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
                return { error: new Error(error.message) }
            }
            return { error: null }
        } catch (err) {
            return { error: err as Error }
        }
    }

    const signUp = async (email: string, password: string, fullName: string) => {
        if (DEMO_MODE) {
            return { error: new Error('Demo mode: Sign up disabled. Disable demo mode to use real authentication.'), needsVerification: false }
        }
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullName },
                },
            })

            if (error) {
                return { error: new Error(error.message), needsVerification: false }
            }

            const needsVerification = !data.session && data.user?.identities?.length === 0 === false

            return { error: null, needsVerification }
        } catch (err) {
            return { error: err as Error, needsVerification: false }
        }
    }

    const signOut = async () => {
        if (DEMO_MODE) {
            // In demo mode, just reset to demo state
            setUser(DEMO_USER)
            setProfile(DEMO_PROFILE)
            setSession(DEMO_SESSION)
            return
        }
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
        setSession(null)
    }

    const resetPassword = async (email: string) => {
        if (DEMO_MODE) {
            return { error: new Error('Demo mode: Password reset disabled.') }
        }
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })
            if (error) {
                return { error: new Error(error.message) }
            }
            return { error: null }
        } catch (err) {
            return { error: err as Error }
        }
    }

    const updatePassword = async (newPassword: string) => {
        if (DEMO_MODE) {
            return { error: new Error('Demo mode: Password update disabled.') }
        }
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword })
            if (error) {
                return { error: new Error(error.message) }
            }
            return { error: null }
        } catch (err) {
            return { error: err as Error }
        }
    }

    const updateProfile = async (updates: Partial<Profile>) => {
        if (DEMO_MODE) {
            // In demo mode, just update local state
            setProfile(prev => prev ? { ...prev, ...updates } : null)
            return { error: null }
        }
        if (!user) {
            return { error: new Error('No user logged in') }
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await updateProfileFn(user.id, updates as any)
            if (error) {
                return { error: new Error(error.message) }
            }
            setProfile(data)
            return { error: null }
        } catch (err) {
            return { error: err as Error }
        }
    }

    const value: AuthContextType = {
        user,
        profile,
        session,
        isLoading,
        isAuthenticated: DEMO_MODE ? true : !!session,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        refreshProfile,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
