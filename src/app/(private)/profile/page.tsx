
import { createSupabaseServerClient } from '@/api/server'
import CreatePost from './CreatePost'
import SignOutButton from '@/components/ui/SignOutButton' 
import PostComponent from '@/components/impocomponnent/postComponent'
import Image from 'next/image'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

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


export default async function Dashboard() {

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div className="p-6">Please sign in.</div>
  }
  const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single()


      

  const avatarUrl = profile?.avatar_url
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_avatars/${profile.avatar_url}?t=${Date.now()}`
    : '/default-avatar.png'

  // know we need to get posts

const { data: posts, error: postsErr } = await supabase
    .from('posts')
    .select('id,user_id,image_path,title,description,location,created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as unknown as {
      data: Post[] | null
      error: { message: string } | null
    }
  //errors of fetcihng posts:
 if (postsErr) {
    return <p className="text-red-600">Failed to read posts: {postsErr.message}</p>
  }



    const paths = posts.map((p) => p.image_path)
  const { data: signedList, error: signErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(paths, 60 * 60) // 1 hour

 //combining post data with now signed URLS
      const items = posts.map((p, i) => ({
    ...p,
    url: signedList?.[i]?.signedUrl ?? '',
  }))









 


return (<>
<main className="max-w-sm mx-auto p-4 space-y-6">
  {/* Profile Header */}
  <section className="flex items-center justify-between">
    {/* Left: Avatar */}
    <Image src={avatarUrl} alt='Avatar' width={80} height={80}  className="w-20 h-20 rounded-full " />

    {/* Right: Info */}
    <div className="flex flex-col items-start ml-4">
      <h2 className="font-semibold text-sm">{profile?.full_name}</h2>
      <p className="text-slate-500 text-sm">{items.length}</p>
      <p className="text-slate-500 text-sm">post</p>
    </div>

    {/* Sign Out button */}
    <SignOutButton/>
  </section>

  {/* Action Buttons */}
  <section className="flex justify-center gap-15">
    <Link href="/profile/edit">
    <button className="px-8 py-2 bg-slate-200 rounded-md text-sm hover:bg-slate-300">Edit Profile</button>
    </Link>
      <Link href="/profile/createpost">
    <button className="px-8 py-2 bg-slate-200 rounded-md text-sm hover:bg-slate-300">Create Post</button>
    </Link>
  </section>

  {/* Posts Grid */}
 
</main>
  <div
        aria-hidden
        className="h-px mx-2 my-1 bg-slate-300/20 dark:bg-white/10"
      />
 <ul className="grid grid-cols-3 gap-0.5 p-1">
  {items.map((post) => (
    <li key={post.id} className="w-full">
      <Link href={`/dashboard/${post.id}`} scroll={false} prefetch={false}>
        <img
          src={post.url}
          alt="Post"
          className="w-full h-[200px] object-cover block bg-slate-300"
        />
      </Link>
    </li>
  ))}
  </ul>
  </>)
}