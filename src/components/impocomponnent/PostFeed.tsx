// components/impocomponnent/PostFeed.tsx
//this retruns all users posts, sorted by time.
import 'server-only'
import { createSupabaseServerClient } from '@/api/server'
import PostCard from "./PostCard"
import Link from 'next/link'
import { Fragment } from 'react'

const POSTS_BUCKET = 'posts'
const AVATARS_BUCKET = 'profile_avatars'

type Post = {
  id: string
  user_id: string
  image_path: string
  title: string | null
  description: string | null
  location: string | null
  created_at: string

}

type Profile = {
  id: string            // = auth.users.id
  full_name: string | null
  avatar_url: string | null
}

export default async function PostFeed() {
  const supabase = await createSupabaseServerClient()

  // 1) Read posts (anyone)
  const { data: posts, error: postsErr } = await supabase
    .from('posts')
    .select('id,user_id,image_path,title,description,location,created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  if (postsErr) return <p className="text-red-600">Failed to load posts: {postsErr.message}</p>
  if (!posts || posts.length === 0) return <p className="text-sm text-slate-500">No posts yet.</p>

  // 2) Read author profiles by profiles.id (== posts.user_id)
  const userIds = Array.from(new Set(posts.map(p => p.user_id)))
  const { data: profs, error: profErr } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', userIds)

  if (profErr) return <p className="text-red-600">Failed to load profiles: {profErr.message}</p>

  const profileById = new Map<string, Profile>((profs ?? []).map(p => [p.id, p]))

  // 3) Sign post image URLs (works for public/private)
  const paths = posts.map(p => p.image_path)
  const { data: signed, error: signErr } = await supabase.storage
    .from(POSTS_BUCKET)
    .createSignedUrls(paths, 60 * 60) // 1h

  if (signErr) return <p className="text-red-600">Could not sign images: {signErr.message}</p>

  const items = posts.map((p, i) => {
    const profile = profileById.get(p.user_id) || null
    let avatarUrl: string | null = null
    if (profile?.avatar_url) {
      const { data } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(profile.avatar_url)
      avatarUrl = data?.publicUrl ?? null
    }
    return {
      ...p,
      profile,
      avatarUrl,
      url: signed?.[i]?.signedUrl ?? '',
    }
  })

  return (
    <section className="mx-auto w-full max-w-[560px] px-2">
      <header className="flex items-end justify-between">
        <h2 className="text-lg md:text-xl font-semibold">Latest posts</h2>
        <p className="text-xs text-slate-500">{items.length} items</p>
      </header>

      <ul className="grid grid-cols-1 gap-3">
        {items.map((p, i) => (
  
     <Fragment key={p.id}>
    <PostCard
      url={p.url}
      id={p.id}
      title={p.title}
      description={p.description}
      location={p.location}
      created_at={p.created_at}
      authorName={p.profile?.full_name}
      avatarUrl={p.avatarUrl}
      userId={p.user_id}
      showProf={true}
    />
    {i < items.length - 1 && (
      <div
        aria-hidden
        className="h-px mx-2 my-1 bg-slate-300/20 dark:bg-white/10"
      />
    )}
   </Fragment>
    ))}
      </ul>
    </section>
  )
}
