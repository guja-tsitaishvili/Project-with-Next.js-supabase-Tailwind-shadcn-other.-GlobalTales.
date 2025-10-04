import 'server-only'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/api/server'

const AVATARS_BUCKET = 'profile_avatars'
const POSTS_BUCKET = 'posts'

type Profile = {
  id: string
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  updated_at: string | null
}

type Post = {
  id: string
  image_path: string
  title: string | null
  description: string | null
  location: string | null
  created_at: string
}

type PostWithUrl = Post & { imagePublicUrl: string | null }


type GetDataResult = {
  profile: Profile | null
  posts: PostWithUrl[]
  avatarPublicUrl: string | null
}

async function getData(userId: string) {
  const supabase = await createSupabaseServerClient()

  // 1) profile
  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('id, full_name, bio, avatar_url, updated_at')
    .eq('id', userId)
    .single<Profile>()

  if (pErr || !profile) return { profile: null, posts: [] as PostWithUrl[], avatarPublicUrl: null }

  const avatarPublicUrl = profile.avatar_url
    ? supabase.storage.from(AVATARS_BUCKET).getPublicUrl(profile.avatar_url).data.publicUrl
    : null

  // 2) posts by this user
  const { data: posts, error: postsErr } = await supabase
    .from('posts')
    .select('id, image_path, title, description, location, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (postsErr || !posts) return { profile, posts: [] as PostWithUrl[], avatarPublicUrl }

  // attach public URLs for post images
  const postsWithUrls: PostWithUrl[] = posts.map((p): PostWithUrl => ({
  ...p,
  imagePublicUrl: p.image_path
    ? supabase.storage.from(POSTS_BUCKET).getPublicUrl(p.image_path).data.publicUrl
    : null,
}))

  return { profile, posts: postsWithUrls, avatarPublicUrl }
}

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const { profile, posts, avatarPublicUrl } = await getData(params.id)
  if (!profile) notFound()

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Header */}
      <section className="flex items-center gap-4">
        {avatarPublicUrl ? (
          <Image
            src={avatarPublicUrl}
            alt="Profile avatar"
            width={84}
            height={84}
            className="h-20 w-20 rounded-full object-cover ring-1 ring-black/10"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-slate-200 ring-1 ring-black/10" />
        )}
        <div>
          <h1 className="text-2xl font-semibold">
            {profile.full_name ?? 'Unnamed user'}
          </h1>
          {profile.bio && <p className="text-sm text-slate-600">{profile.bio}</p>}
        </div>
      </section>

      {/* Posts grid */}
      <section>
        <h2 className="mb-3 text-lg font-medium">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-slate-600">No posts yet.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {posts.map((p) => (
              <li key={p.id} className="rounded-xl border bg-white/60 p-3 shadow-sm">
                <Link href={`/dashboard/photo/${p.id}`} className="block">
                  {p.imagePublicUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imagePublicUrl}
                      alt={p.title ?? 'Post image'}
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="aspect-square w-full rounded-lg bg-slate-200" />
                  )}
                  <div className="mt-2 space-y-1">
                    <p className="font-medium truncate">{p.title ?? 'Untitled'}</p>
                    {p.location && (
                      <p className="text-xs text-slate-600 truncate">{p.location}</p>
                    )}
                    <p className="text-xs text-slate-500">
                      {new Date(p.created_at).toLocaleString()}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
