// app/(private)/dashboard/page.tsx
import { createSupabaseServerClient } from '@/api/server'
import SignOutButton from '@/components/ui/SignOutButton' // <-- adjust path if yours differs
import { HTMLInputAutoCompleteAttribute, useRef } from 'react'
import UploadImagesComp from './UploadImagesComp'
export const dynamic = 'force-dynamic' // per-request (reads cookies)

export default async function Dashboard() {
  
  const supabase = await createSupabaseServerClient()
 
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">This is dashboard</h1>
      {user?.email && (
        <p className="text-sm opacity-80">Signed in as {user.email}</p>
      )}
      <SignOutButton />
      <UploadImagesComp />
    </main>
  )
}
