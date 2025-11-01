// app/(private)/dashboard/page.tsx
import { createSupabaseServerClient } from '@/api/server'
import Image from 'next/image'
import SignOutButton from '@/components/ui/SignOutButton'
import Link from 'next/link'
import PostFeed from '@/components/impocomponnent/PostFeed'
import SearchBar from './SearchBar'
import ScrollReset from './Scrollreset'
import LogoLink from '@/components/simplecomps/LogoLink'
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
    <main className="bg-background">
      {/* Header Row */}
       <ScrollReset />
       <header className=" top-0 z-10  supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 py-3 flex-wrap sm:flex-nowrap gap-3">

        {/* Left: Logo + Map + ? */}
        <div className="flex items-center gap-4">
          <LogoLink />

          <div className="flex items-center gap-3 text-sm md:text-base">
            <Link
              href="/map"
              className="text-primary hover:opacity-80 md:mx-6"
            >
              <Image alt="map logo" src={'/VisData/markers-removebg-preview.png'} width={50} height={50}/>
            </Link>

            <Link
              href="/dashboard/Q"
              className="text-foreground/80 hover:text-foreground"
              aria-label="Questions"
              title="Questions"
            >
              <Image alt="question" src={'/VisData/questionmark.png'} width={30} height={30}/>
            </Link>
          </div>
        </div>

        {/* Right: Search + Sign out + Profile */}
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <div className="flex items-center gap-3 ml-auto">
            <SearchBar />
            <SignOutButton />
          </div>

          <Link href="/profile" title="Go to profile" aria-label="Open profile">
            {avatarPublicUrl ? (
              <Image
                src={avatarPublicUrl}
                alt="Profile"
                width={42}
                height={42}
                className="rounded-full object-cover ring-1 ring-ring/30 shadow-sm"
                style={{ aspectRatio: "1 / 1" }}
              />
            ) : (
              <div
                className="h-10 w-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold ring-1 ring-border/40"
              >
                {initials}
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Dashboard title + email */}
      {user?.email && (
        <p className="text-sm md:text-base opacity-80 text-center break-words text-muted-foreground">
          Signed in as {profile?.full_name}
        </p>
      )}
    </header>
      {/* Posts feed */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <PostFeed />
      </div>
    </main>
  )
}
