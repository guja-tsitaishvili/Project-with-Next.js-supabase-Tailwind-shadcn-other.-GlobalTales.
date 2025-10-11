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
      className="absolute top-2 right-2 z-10 bg-black text-white rounded-full px-2 py-1 hover:bg-red-600 transition"
    >
      X
    </button>
  )
}
