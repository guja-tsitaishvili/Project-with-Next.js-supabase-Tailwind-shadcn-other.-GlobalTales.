
import type { JSX } from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Auth from '@/components/ui/auth/Auth'
import { createSupabaseServerClient } from '@/api/server'



export default async function Home(): Promise<JSX.Element> {
  
  const supabase = await createSupabaseServerClient()
 
    const {
    data: { user  },
    error
    } = await supabase.auth.getUser()
    if (error) {
      console.error('home getUser error:', error)
  }


  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="font-sans grid min-h-screen place-items-center p-8 sm:p-20">
      <Auth />
    </div>
  )
}