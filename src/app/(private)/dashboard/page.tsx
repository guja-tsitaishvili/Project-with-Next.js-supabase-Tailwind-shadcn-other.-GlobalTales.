// app/(private)/dashboard/page.tsx
import { createSupabaseServerClient } from '@/api/server'
import Image from 'next/image'
import SignOutButton from '@/components/ui/SignOutButton'
import Link from 'next/link'
import PostFeed from '@/components/impocomponnent/PostFeed'
export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: { avatar_url: string | null; full_name: string | null } | null = null
  if (user) {
    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_url, full_name')
      .eq('id', user.id)
      .single()
    profile = error ? null : data
  }

  let avatarPublicUrl: string | null = null
  if (profile?.avatar_url) {
    const { data } = supabase.storage.from('profile_avatars').getPublicUrl(profile.avatar_url)
    avatarPublicUrl = data?.publicUrl ?? null
  }

  const initials = (profile?.full_name ?? user?.email ?? '?').slice(0, 1).toUpperCase()

  return (
<main className="sticky top-0 z-10 bg-white/80 backdrop-blur 
  supports-[backdrop-filter]:bg-white/60 shadow-sm">
  <div className=" flex items-center justify-between px-4 py-3">
    {/* Left: Logo */}
    <h3 className="font-extrabold text-xl tracking-tight">Global Tail</h3>
     <Link href={'/map'}> Map link</Link>
    {/* Right: Sign out + Avatar */}
    <div className="flex items-center gap-3">
      <SignOutButton />
      <Link href="/profile" title="Go to profile" aria-label="Open profile">
        {avatarPublicUrl ? (
          <Image
            src={avatarPublicUrl}
            alt="Profile"
            width={40}
            height={40}
            className="h-10 w-10 md:h-11 md:w-11 rounded-full object-cover ring-1 ring-black/10 shadow-sm"
          />
        ) : (
          <div
            className="h-10 w-10 md:h-11 md:w-11 rounded-full bg-gradient-to-br from-slate-200 to-slate-300
                       text-slate-700 flex items-center justify-center font-semibold select-none 
                       shadow-sm ring-1 ring-black/5"
            aria-hidden
          >
            {initials}
          </div>
        )}
      </Link>
    </div>
  </div>



      <h1 className="text-xl md:text-2xl font-semibold text-center">This is dashboard</h1>

      {user?.email && (
        <p className="text-sm md:text-base opacity-80 text-center break-words">
          Signed in as {user.email}
        </p>
      )}

      {/* Global feed of ALL posts */}
      <div className="w-full max-w-6xl mx-auto">
        <PostFeed />
      </div>
    </main>
  )
}
