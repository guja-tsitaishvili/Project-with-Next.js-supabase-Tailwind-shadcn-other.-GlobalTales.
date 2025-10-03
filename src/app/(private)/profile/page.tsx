// app/(private)/profile/page.tsx
import { createSupabaseServerClient } from '@/api/server'
import UploadAvatar from './upload-avatar'
import CreatePost from './CreatePost'
import PostComponent from '@/components/impocomponnent/postComponent'
export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div className="p-6">Please sign in.</div>
  }
  const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

  return (
    <main className="p-6 space-y-6 max-w-xl mx-auto">
      <div className='flex flex-row gap-10 items-center'>
      <h1 className="text-2xl font-semibold">Your profile:</h1>
      <h3 className="text-2xl font-semibold"> {profile ? profile.full_name : "No name set"} </h3>
      </div>
      <UploadAvatar />

      <CreatePost />

         <PostComponent />
    </main>
  )
}