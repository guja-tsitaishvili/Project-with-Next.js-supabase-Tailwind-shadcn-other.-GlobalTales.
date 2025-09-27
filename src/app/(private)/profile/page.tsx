// app/(private)/profile/page.tsx
import { createSupabaseServerClient } from '@/api/server'
import UploadAvatar from './upload-avatar'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div className="p-6">Please sign in.</div>
  }

  return (
    <main className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold">Your profile</h1>
      <UploadAvatar />
    </main>
  )
}