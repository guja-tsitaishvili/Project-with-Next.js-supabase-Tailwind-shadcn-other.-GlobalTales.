import { createSupabaseServerClient } from "@/api/server"
import { notFound } from "next/navigation"
import { Modal } from "@/components/ui/Modal"
export default async function SinglePostPage({
  params
}: {
  params: { id: string }
}) {

  const { id } = await params  // ✅ no await here
  console.log("this is id: " + id)
  const supabase = await createSupabaseServerClient()
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !post) {
  // ✅ log the error for debugging
    notFound()
  }
 
  return (
    <Modal>
  <main className="max-w-2xl mx-auto p-6 space-y-4">
    <h1 className="text-xl font-bold">{post.title ?? "Untitled"}</h1>

    {post.image_path && (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/${post.image_path}`}
        alt={post.title ?? "Post image"}
        className="w-full rounded-lg"
      />
    )}

    <p>{post.description}</p>
    <p className="text-sm text-slate-500">
      {new Date(post.created_at).toLocaleString()}
    </p>
  </main>
    </Modal>
  )
}