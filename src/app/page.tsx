
import type { JSX } from 'react'
import { type ReactElement } from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Auth from '@/components/ui/auth/Auth'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export default async function Home(): Promise<JSX.Element> {
   const cookieStore = await  cookies()
  // Inline per-request Supabase *server* client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
     {
      cookies: {
        // Read a cookie value
        get(name: string) {
          return  cookieStore.get(name)?.value
        },
        // Set/remove are NO-OPs in Server Components (not allowed to mutate headers here).
        // We still provide them to satisfy the API.
        set(
          _name: string,
          _value: string,
          _options?: CookieOptions
        ) {
          /* no-op in RSC */
        },
        remove(
          _name: string,
          _options?: CookieOptions
        ) {
          /* no-op in RSC */
        },
      },
      }
  )
 

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="font-sans grid min-h-screen place-items-center p-8 sm:p-20">
      <Auth />
    </div>
  )
}