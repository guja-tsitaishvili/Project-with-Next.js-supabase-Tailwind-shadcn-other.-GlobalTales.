// app/(private)/posts/CreatePost.tsx
'use client'
//AI +
import { usePostsStore } from "@/store/usePostsStore";
import { useState, useTransition, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import client from '@/api/client' // your Supabase browser client
// optional: import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
type Props = {
  onCreated?: () => void,
  initialLocation?: string   // optional callback after success
}

export default function CreatePost({ onCreated, initialLocation }: Props) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { fetchPosts } = usePostsStore();
  
  useEffect(() => {
    if (initialLocation) setLocation(initialLocation)
  }, [initialLocation])


  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    setPreview(f ? URL.createObjectURL(f) : null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!file) { setError('Please choose an image.'); return }

    startTransition(async () => {
      // 1) who is the user?
      const { data: { user }, error: userErr } = await client.auth.getUser()
      if (userErr || !user) { setError('You must be signed in.'); return }

      // 2) build the storage path under the user’s folder
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const path = `${user.id}/${uuid()}.${ext}`

      // 3) upload the file to the `posts` bucket
      const { error: upErr } = await client.storage
        .from('posts')
        .upload(path, file, { upsert: false, contentType: file.type })
      if (upErr) { setError(upErr.message); return }

      // 4) insert metadata row (RLS will check user_id === auth.uid())
      const { error: rowErr } = await client
        .from('posts')
        .insert({
          user_id: user.id,
          image_path: path,
          title: title || null,
          description: description || null,
          location: location || null,
        })
      if (rowErr) { setError(rowErr.message); return }



      // optional: toast.success('Posted!')
      // reset form
      await fetchPosts();

      router.refresh()

      setFile(null)
      setPreview(null)
      setTitle('')
      setDescription('')
      setLocation('')

      onCreated?.()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 max-w-md">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Image</label>
        <input type="file" accept="image/*" onChange={onPickFile} required />
        {preview && (
          // If your bucket is PUBLIC you can later render via a public URL.
          // This preview is just the local object URL before upload.
          <img src={preview} alt="Preview" className="mt-2 w-full rounded-lg" />
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border p-1"
          placeholder="Sunset over Batumi"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Location</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-md border p-1"
          placeholder="Tbilisi, Georgia"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border p-2"
          rows={3}
          placeholder="Short caption or story..."
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {isPending ? 'Posting…' : 'Create post'}
      </button>
    </form>
  )
}
