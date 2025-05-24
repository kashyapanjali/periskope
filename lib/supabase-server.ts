import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

export const createServerClient = async (): Promise<ReturnType<typeof createSupabaseServerClient<Database>>> => {
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createSupabaseServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        const cookie = cookieStore.get(name)
        return cookie?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // Handle cookie setting error
          console.error('Error setting cookie:', error)
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // Handle cookie removal error
          console.error('Error removing cookie:', error)
        }
      },
    },
    global: {
      fetch: (...args: Parameters<typeof fetch>) => fetch(...args),
    },
  })
}

// Mock client for development/preview when environment variables aren't set
function createMockClient() {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
  }
}
