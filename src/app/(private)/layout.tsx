
import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/api/server'

type PrivatePagesLayoutProps = {
  children: ReactNode
}
export const dynamic = 'force-dynamic'

export default async function PrivateLayout({ children }: PrivatePagesLayoutProps) {
  const supabase = await createSupabaseServerClient() // ← await the factory now
  const { data: { user } } = await supabase.auth.getUser() //i dont know how this gives user.
 console.log(user + "  <- if this is null its bad becouse its from (private)/layout.tsx, it bounces us back")
  if (!user) redirect('/')

  return <>{children}</>
}