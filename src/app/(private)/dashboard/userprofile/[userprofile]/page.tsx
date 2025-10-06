export const dynamic = 'force-dynamic'
import { createSupabaseServerClient } from "@/api/server"
import Image from 'next/image'
import PostCard from "@/components/impocomponnent/PostCard"
type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  updated_at: string
}
type Post = {
  id: string
  title: string | null
  image_path: string | null
  location: string | null
  created_at: string
  user_id: string
  description: string | null
}

type PostWithUrl = Post & { imagePublicUrl: string | null }

const AVATARS_BUCKET = 'profile_avatars'
const POSTS_BUCKET = 'posts'


export default async function Page(
  { params } : { params : Promise< { userprofile : string} > } 
){

    const supabase = await createSupabaseServerClient()

    
   const {userprofile} = await params


    const {data: profile, error } = await supabase
     .from('profiles')
     .select('*')
     .eq('id', userprofile)
     .maybeSingle<Profile>()
    
    console.log(profile)

    if (error) return <pre className="p-4 text-red-600">{error.message}</pre>
    if (!profile) return <p className="p-4">Profile not found.</p>

    let avatarPublicUrl: string | null = null

 if (profile?.avatar_url) {
    const { data } = supabase.storage.from('profile_avatars').getPublicUrl(profile.avatar_url)
     avatarPublicUrl = data?.publicUrl ?? null
  }

  const {data:postsRaw} = await supabase
  .from('posts')
  .select('id, title, image_path, created_at, user_id, description')
  .eq('user_id', userprofile) 
  .order('created_at', { ascending: false })
  .overrideTypes<Post[], { merge: false }>()


  const posts: Post[] = postsRaw ?? []

const postsWithUrl: PostWithUrl[] = posts.map((p) => {
    if (!p.image_path) return { ...p, imagePublicUrl: null }
    const { data } = supabase.storage
      .from(POSTS_BUCKET)
      .getPublicUrl(p.image_path)
    return { ...p, imagePublicUrl: data?.publicUrl ?? null }
  })
  
  return (
     <div className="p-5 space-y-4">
      <h1 className="text-xl font-bold">{profile.full_name ?? 'Unnamed'}</h1>
      {avatarPublicUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <Image src={avatarPublicUrl}
        alt="avatar" 
        width={96}
        height={96}
        className="h-24 w-24 rounded-full object-cover" />
      ) : (
        <div className="h-24 w-24 rounded-full bg-slate-200" />
      )}
      <p className="text-sm text-slate-600">
        profile updated: {new Date(profile.updated_at).toLocaleString()}
      </p>
       <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {postsWithUrl.map((p) => (
          <li key={p.id} className="rounded-lg border p-2">
            <div className="font-medium">{p.title ?? 'Untitled'}</div>
            <div className="text-xs text-slate-500">
              {new Date(p.created_at).toLocaleString()}
            </div>

            {p.imagePublicUrl ? (
              <PostCard
           key={p.id}
           id={p.id}
           url={p.imagePublicUrl}
           title={p.title}
           description={p.description}
           location={p.location ?? null}
           created_at={p.created_at}
           userId={p.user_id} 
              />
            ) : (
              <div className="aspect-square w-full rounded bg-slate-200" />
            )}
          </li>
        ))}
      </ul>
      </div>
   
)
}