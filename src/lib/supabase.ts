import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Supabase client for browser-side operations
 * Uses the anon key for public access with RLS policies
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

/**
 * Helper to get the current user session
 * @returns The current session or null
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Error getting session:', error.message)
    return null
  }
  return session
}

/**
 * Helper to get the current user
 * @returns The current user or null
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user:', error.message)
    return null
  }
  return user
}

/**
 * Sign up with email and password
 * @param email User's email address
 * @param password User's password
 * @param fullName User's full name
 * @returns The user data or error
 */
export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })
  return { data, error }
}

/**
 * Sign in with email and password
 * @param email User's email address
 * @param password User's password
 * @returns The session data or error
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

/**
 * Sign out the current user
 * @returns Error if any
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Request a password reset email
 * @param email User's email address
 * @returns Error if any
 */
export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  return { data, error }
}

/**
 * Update the user's password
 * @param newPassword The new password
 * @returns The user data or error
 */
export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  return { data, error }
}

/**
 * Resend verification email
 * @param email User's email address
 * @returns Error if any
 */
export async function resendVerificationEmail(email: string) {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
  })
  return { data, error }
}

/**
 * Get user profile from the profiles table
 * @param userId The user's ID
 * @returns The profile data or error
 */
export async function getProfile(userId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

/**
 * Update user profile
 * @param userId The user's ID
 * @param updates The profile fields to update
 * @returns The updated profile or error
 */
export async function updateProfile(userId: string, updates: {
  full_name?: string
  bio?: string | null
  location?: string | null
  website?: string | null
  avatar_url?: string | null
  theme_preference?: 'light' | 'dark' | 'system'
  sidebar_collapsed?: boolean
  email_notifications?: Record<string, boolean>
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

/**
 * Upload avatar image
 * @param userId The user's ID
 * @param file The image file to upload
 * @returns The public URL or error
 */
export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/avatar.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    return { data: null, error: uploadError }
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
  return { data: data.publicUrl, error: null }
}

/**
 * Delete avatar image
 * @param userId The user's ID
 * @returns Error if any
 */
export async function deleteAvatar(userId: string) {
  // List all files in the user's folder
  const { data: files, error: listError } = await supabase.storage
    .from('avatars')
    .list(userId)

  if (listError) {
    return { error: listError }
  }

  if (files && files.length > 0) {
    const filePaths = files.map((file) => `${userId}/${file.name}`)
    const { error } = await supabase.storage.from('avatars').remove(filePaths)
    return { error }
  }

  return { error: null }
}
