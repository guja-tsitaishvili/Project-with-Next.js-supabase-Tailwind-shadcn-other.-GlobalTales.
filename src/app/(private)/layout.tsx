
// app/(private)/layout.tsx
import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/api/server'

export const dynamic = 'force-dynamic'

export default async function PrivateLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  return <>{children}</>
}
// correct code