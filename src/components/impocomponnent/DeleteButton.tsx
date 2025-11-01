'use client'
import client from '@/api/client'
import { useRouter } from 'next/navigation'
type DeleteButtonProps = {
  postId: string
}

export default function DeleteButton({ postId }: DeleteButtonProps) {
    const router = useRouter()
  async function handleDelete() {
      
      const { error } = await client.from('posts').delete().eq('id', postId)
      if(error) {
        console.log('Delete failed')
      }
      else{
        console.log('Delete Post:', postId)
        
        router.refresh()
      }
    // You can later add a Supabase delete call or use a mutation here
  }

  return (
    <button
      onClick={handleDelete}
      className="absolute  right-0 z-10 
  flex items-center justify-center
  w-6 h-6 rounded-full 
  bg-primary text-white text-xs 
  hover:bg-red-600 transition"
    >
      X
    </button>
  )
}
