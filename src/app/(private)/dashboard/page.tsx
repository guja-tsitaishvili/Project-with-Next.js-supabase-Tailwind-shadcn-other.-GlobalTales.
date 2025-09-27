// app/(private)/dashboard/page.tsx
import { createSupabaseServerClient } from '@/api/server'
import Image from 'next/image'
import SignOutButton from '@/components/ui/SignOutButton' // <-- adjust path if yours differs
import { HTMLInputAutoCompleteAttribute, useRef } from 'react'
import Link from 'next/link'

import UploadImagesComp from './UploadImagesComp'
export const dynamic = 'force-dynamic' // per-request (reads cookies)

export default async function Dashboard() {
  
  const supabase = await createSupabaseServerClient()

  

  const {
    data: { user },
  } = await supabase.auth.getUser()
  //AI + 
  let profile: { avatar_url: string | null; full_name: string | null } | null;
  if (user) {
const { data, error } =
    user
      ? await supabase.from('profiles').select('avatar_url, full_name').eq('id', user.id).single()
      : { data: null}
   // Derive 1–2 letter initials (email/user_metadata/name if available)
  profile = error ? null : data;
} else {
  profile = null;
}

 let avatarPublicUrl: string | null = null;

if (profile?.avatar_url) {
  const { data } = supabase.storage.from('profile_avatars').getPublicUrl(profile.avatar_url);
  avatarPublicUrl = data?.publicUrl ?? null;
}

  const initials = (profile?.full_name ?? user?.email ?? '?').slice(0, 1).toUpperCase()
  return (
<main className="min-h-screen px-4 py-4 space-y-6 md:space-y-8">
  {/* Top bar (mobile-first) */}
  <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 flex items-center justify-end gap-3 shadow-sm md:justify-end">
    <SignOutButton />
    <Link href="/profile" title="Go to profile" className="block" aria-label="Open profile">
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

  <h1 className="text-xl md:text-2xl font-semibold text-center">This is dashboard</h1>

  {user?.email && (
    <p className="text-sm md:text-base opacity-80 text-center break-words">
      Signed in as {user.email}
    </p>
  )}

  <div className="w-full max-w-md md:max-w-2xl mx-auto p-4 md:p-6 rounded-2xl border shadow-sm bg-white">
    <UploadImagesComp />
  </div>
</main>

  )
}
