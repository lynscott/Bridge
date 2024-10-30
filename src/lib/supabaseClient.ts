import { createClient, User } from '@supabase/supabase-js'
import { invoke } from '@tauri-apps/api/core'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function verifyToken(): Promise<boolean> {
  try {
    const hasToken = await invoke<boolean>('verify_token')
    if (!hasToken) return false

    const { data: { user } } = await supabase.auth.getUser()
    return !!user
  } catch (error) {
    console.error('Error verifying token:', error)
    return false
  }
}

export async function refreshToken(): Promise<User | undefined> {
  try {
    const { data: { user }, error } = await supabase.auth.refreshSession()
    if (error) throw error
    return user ?? undefined
  } catch (error) {
    console.error('Error refreshing token:', error)
    return undefined
  }
}

export async function logout(): Promise<void> {
  try {
    await supabase.auth.signOut()
    await invoke('save_token', { token: '' }) // Clear the token in Rust backend
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

export async function getCurrentUser(): Promise<User | undefined> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user ?? undefined
  } catch (error) {
    console.error('Error getting current user:', error)
    return undefined
  }
}