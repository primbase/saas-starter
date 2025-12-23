/**
 * Database types for Supabase
 * In production, these should be auto-generated using:
 * npx supabase gen types typescript --local > src/types/database.types.ts
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string
                    avatar_url: string | null
                    bio: string | null
                    location: string | null
                    website: string | null
                    theme_preference: 'light' | 'dark' | 'system'
                    sidebar_collapsed: boolean
                    email_notifications: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    full_name: string
                    avatar_url?: string | null
                    bio?: string | null
                    location?: string | null
                    website?: string | null
                    theme_preference?: 'light' | 'dark' | 'system'
                    sidebar_collapsed?: boolean
                    email_notifications?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string
                    avatar_url?: string | null
                    bio?: string | null
                    location?: string | null
                    website?: string | null
                    theme_preference?: 'light' | 'dark' | 'system'
                    sidebar_collapsed?: boolean
                    email_notifications?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            login_sessions: {
                Row: {
                    id: string
                    user_id: string
                    device_info: string
                    ip_address: string | null
                    location: string | null
                    logged_in_at: string
                    last_active_at: string
                    is_active: boolean
                }
                Insert: {
                    id?: string
                    user_id: string
                    device_info: string
                    ip_address?: string | null
                    location?: string | null
                    logged_in_at?: string
                    last_active_at?: string
                    is_active?: boolean
                }
                Update: {
                    id?: string
                    user_id?: string
                    device_info?: string
                    ip_address?: string | null
                    location?: string | null
                    logged_in_at?: string
                    last_active_at?: string
                    is_active?: boolean
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type LoginSession = Database['public']['Tables']['login_sessions']['Row']
