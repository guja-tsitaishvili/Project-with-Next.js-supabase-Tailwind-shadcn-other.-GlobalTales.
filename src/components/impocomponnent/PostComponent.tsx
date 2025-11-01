// app/(private)/posts/PostComponent.tsx
//returns only posts that are from specific user
import 'server-only'
import { createSupabaseServerClient } from '@/api/server'
import { notFound } from 'next/navigation'
import PostCard from './PostCard'
import DeleteButton from './DeleteButton'
// If you use a single bucket, keep it as a constant:
const BUCKET = 'posts'

type Post = {
  id: string
  user_id: string
  image_path: string
  title: string | null
  description: string | null
  location: string | null
  created_at: string
}

/**
 * Server Component: lists all posts for the current user (read-only).
 * Uses SSR + RLS; no client-side code/hooks.
 */
export default async function PostComponent() {
  const supabase = await createSupabaseServerClient()

  // Who is the user?
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()

  if (userErr) {
    // You can choose a different UX here:
    return <p className="text-red-600">Auth error: {userErr.message}</p>
  }
  if (!user) {
    // Guard route or show message
    notFound()
  }

  // Fetch *all* posts for this user (RLS should also enforce this)
  const { data: posts, error: postsErr } = await supabase
    .from('posts')
    .select('id,user_id,image_path,title,description,location,created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as unknown as {
      data: Post[] | null
      error: { message: string } | null
    }

  if (postsErr) {
    return <p className="text-red-600">Failed to read posts: {postsErr.message}</p>
  }
  if (!posts || posts.length === 0) {
    return <p className="text-sm text-slate-500">You have no posts yet.</p>
  }

  // Generate image URLs on the server (works for private buckets).
  // If your bucket is public, you could use getPublicUrl instead.
  const paths = posts.map((p) => p.image_path)
  const { data: signedList, error: signErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(paths, 60 * 60) // 1 hour

  if (signErr) {
    return <p className="text-red-600">Failed to sign URLs: {signErr.message}</p>
  }


  // Merge signed URLs back into posts by index
  const items = posts.map((p, i) => ({
    ...p,
    url: signedList?.[i]?.signedUrl ?? '',
  }))


  return (
    <section className="space-y-4">
      
      <header>
        <h2 className="text-xl font-semibold">Your posts</h2>
        <p className="text-sm text-slate-500">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        
        {items.map((post) => (
          <li key={post.id} className="relative">
           <DeleteButton postId={post.id} />
           <div >
         <PostCard
           key={post.id}
           id={post.id}
           url={post.url}
           title={post.title}
           description={post.description}
           location={post.location}
           created_at={post.created_at}
           userId={post.user_id} 
           showProf={false}
          />
          </div>
          </li>
          ))}
      </ul>
      
    </section>
  )
}
