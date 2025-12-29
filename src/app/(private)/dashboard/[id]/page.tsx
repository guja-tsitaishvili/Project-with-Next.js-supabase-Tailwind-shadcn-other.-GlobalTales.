'use client'
import { useEffect, useState } from "react";
import ContextMenu from './ContextMenu';
import client from "@/api/client"; 
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal"
type Post = {
  url:string
  id: string
  user_id: string
  image_path: string
  title: string | null
  description: string | null
  location: string | null
  created_at: string
}
type Profile = {
  full_name: string;
  avatar_url: string;
}

type PostWithUrl = Post & { url: string };

const BUCKET = 'posts'
export default function Page({
  params
}: {
  params: { id: string }
}
){
     const [data, setData] = useState<PostWithUrl  | null>(null);
     const [profile, setProfile] = useState<Profile | null>(null);
     const [currentUser, setCurrentUser] = useState<string | null>(null); 
  const { id } =  params 
    useEffect(() => {
    const fetchData = async () => {
       const { data, error } = await client.auth.getUser()
          const userId = data?.user?.id || null;
          setCurrentUser(userId);
      const { data: postData, error: postError } = await client
        .from("posts") // replace with your table
        .select("user_id,image_path,title,description")
        .eq('id', id)
        .single() as unknown as {
          data: Post | null;
          error: { message: string } | null;
        };

      if (postError) {
        console.error(postError?.message);
      } else if (postData){

        const path = postData.image_path

      console.log("path: " + path);
  const { data: signedData, error: signErr } = await client.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60) // 1 hour

let imageUrl = '/default-avatar.png'; // default fallback

if (!signErr && signedData?.signedUrl) {
  imageUrl = signedData.signedUrl; // only use it if it's valid
}
  

        setData({ ...postData, url: imageUrl });
      
      
       const { data: profile, error: profileError} = await client
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', postData.user_id)
        .single() as unknown as {
          data: { full_name: string; avatar_url: string } | null;
          error: { message: string } | null;
        }
   
if (profileError) {
    console.error(profileError?.message);
  } else {
    setProfile(profile);  // <-- store in state
  }


    
}
  }

    fetchData();
  }, []);

  const isAuthor = data?.user_id === currentUser;
const router = useRouter();


  const avatarUrl = profile?.avatar_url
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_avatars/${profile.avatar_url}?t=${Date.now()}`
    : '/default-avatar.png'

const deletePost = async () => {
    console.log("Deleting post with id:", id);
    // Example: remove from local state
   const { error } = await client
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete post:", error.message);
  } else {
    console.log("Post deleted successfully!");
    router.push("/profile");
  }
  };

return (
   <Modal>

<div className="flex justify-center items-center h-screen bg-gray-200">

  <div className="bg-gray-300 w-96 rounded-xl shadow-lg p-4 relative">

    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
      <Image className="w-12 h-12 rounded-full" alt="avatar" src={avatarUrl} width={80} height={80}/>
      <div className="ml-4">
        <span className="text-gray-700 font-semibold">
              {profile?.full_name}
            </span>
      </div>
    </div>
  {isAuthor ? (
  <ContextMenu
    menuItems={[
      {
        label: "Delete",
        onClick: () => deletePost(),
      }
    ]}
  >
    <div className="text-gray-700 font-bold">&#8230;</div>
  </ContextMenu>
  ) : (
    <></>
  )}
  </div>


   {data?.url ? (
  <Image
    className="w-full h-64 rounded mb-4"
    alt={data.title || "description"}
    src={data.url}
    width={340}
    height={340}
  />
) : (
  <div className="w-full h-64 rounded mb-4 bg-gray-400"></div>
)}


 
     <p className="text-gray-700">
          {data?.description}
        </p>
  </div>
</div>
</Modal>
)
}