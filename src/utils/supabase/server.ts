import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient(isPersistent: boolean = false) {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // If persistent, override the options
              const cookieOptions = isPersistent 
                ? { ...options, maxAge: 60 * 60 * 24 * 30 } // 30 days
                : options
              
              cookieStore.set(name, value, cookieOptions)
            })
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  )
}
