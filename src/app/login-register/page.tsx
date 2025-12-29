import type { JSX } from 'react'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/api/server'
import Auth from '@/components/ui/auth/Auth'

export default async function Home(): Promise<JSX.Element> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) console.error('home getUser error:', error)
  if (user) redirect('/dashboard')

  return (
    <main className="min-h-screen grid place-items-center bg-cover bg-center bg-no-repeat px-4 sm:px-6"
    style={{ backgroundImage: "url('/VisData/background/backgroudnpic2.jpg')" }}>

      <div className="relative z-10">
      <Auth />
      </div>

    </main>
  )
}
