// app/(private)/profile/page.tsx
import { createSupabaseServerClient } from '@/api/server'
import UploadAvatar from './upload-avatar'
import CreatePost from './CreatePost'
import PostComponent from '@/components/impocomponnent/postComponent'
import LogoLink from '@/components/simplecomps/LogoLink'
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
<main className="p-2 sm:p-4 md:p-6 space-y-6 max-w-xl mx-auto">
  {/* Row: Logo + Profile Name */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur sticky top-0 z-20">

      <div className="mx-auto max-w-screen-xl w-full flex justify-between items-center">
        <LogoLink />

        <div className="text-right">
          <h1 className="text-xl sm:text-2xl font-semibold">Your profile:</h1>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-700 dark:text-slate-300">
            {profile ? profile.full_name : "No name set"}
          </h3>
        </div>
        </div>
      </header>

   <main className="p-6 space-y-6 max-w-xl mx-auto">
        <UploadAvatar />
        <CreatePost />
        <PostComponent />
      </main>
</main>

  )
}