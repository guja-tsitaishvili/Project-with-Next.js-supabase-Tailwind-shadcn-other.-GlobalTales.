// src/app/api/auth/session/route.ts
//this is endpoint used for both signed in and signed out operation



import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function POST(req: NextRequest) {
    
  try {
    const { event, session } = (await req.json().catch(() => ({}))) as {
      event?: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | string
      session?: { access_token?: string; refresh_token?: string } | null
    }

    const cookieStore = await cookies() // In route handlers you CAN mutate cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options?: CookieOptions) {
            cookieStore.set({ name, value, ...options }) // <-- WRITES Set-Cookie
          },
          remove(name: string, options?: CookieOptions) {
            cookieStore.set({ name, value: '', expires: new Date(0), ...options }) // <-- CLEARS
          },
        },
      }
    )

    if (event === 'SIGNED_OUT') {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('signOut error:', error)
       
      }
      return NextResponse.json({ ok: true })
    }

    if (event === 'SIGNED_IN' && session?.access_token) {
      const { error } = await supabase.auth.setSession({
        access_token: session.access_token!,
        refresh_token: session.refresh_token ?? '',
      })
      if (error) {
        console.error('setSession error:', error)
        return NextResponse.json({ ok: false, reason: 'setsession-error' }, { status: 500 })
      }
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: false, reason: 'bad-payload' }, { status: 400 })
  } catch (e) {
    console.error('auth/session error:', e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
