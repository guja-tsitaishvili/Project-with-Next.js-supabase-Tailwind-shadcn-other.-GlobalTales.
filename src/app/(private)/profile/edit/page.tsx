'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, useTransition, ChangeEvent } from 'react'
import client from '@/api/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function UploadAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [editingName, setEditingName] = useState(false)
  // Load current avatar on mount
  useEffect(() => {
    void (async () => {
      const { data: { user } } = await client.auth.getUser()
      if (!user) return

      const { data: profile } = await client
        .from('profiles')
        .select('avatar_url, full_name')
        .eq('id', user.id)
        .single()

      if (profile?.avatar_url) {
        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_avatars/${profile.avatar_url}?t=${Date.now()}`
        setAvatarUrl(publicUrl)
      }
      if (profile?.full_name) {
      setName(profile.full_name) // <-- new state for name
}
    })()
  }, [])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    startTransition(async () => {
      const { data: { user }, error: authErr } = await client.auth.getUser()
      if (authErr || !user) {
        toast.error('Not authenticated')
        return
      }

      // overwrite same avatar each time
     const ext = file.name.split('.').pop() || 'jpg'
      const path = `${user.id}/avatar.${ext}`

      const { error: upErr } = await client.storage
        .from('profile_avatars')
        .upload(path, file, { upsert: true, contentType: file.type })

      if (upErr) {
        toast.error(upErr.message)
        return
      }

      // save storage PATH (not URL) to profiles.avatar_url
      const { error: profErr } = await client
        .from('profiles')
        .upsert({ id: user.id, avatar_url: path }, { onConflict: 'id' })

      if (profErr) {
        toast.error(profErr.message)
        return
      }
      // Cache-busting public URL
      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_avatars/${path}?t=${Date.now()}`
      setAvatarUrl(publicUrl)
      toast.success('Avatar updated!')
    })
  }

   const handleChangeName = async () => {
  const { data: { user }, error: authErr } = await client.auth.getUser()
  if (authErr || !user) {
    toast.error("Not authenticated")
    return
  }

  const { error } = await client
    .from("profiles")
    .upsert({ id: user.id, full_name: name }, { onConflict: "id" })

  if (error) {
    toast.error(error.message)
    return
  }

  toast.success("Name updated!")
  setEditingName(false)
}

  return (
  <div className="p-4 max-w-sm mx-auto bg-white rounded-md shadow-md space-y-4">
    {/* Avatar + Name */}
    <div className="flex flex-col items-center gap-2">
      <div className="h-20 w-20 rounded-full overflow-hidden ring-1 ring-black/10">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={80}
            height={80}
            className="h-20 w-20 object-cover"
          />
        ) : (
          <div className="h-20 w-20 flex items-center justify-center text-sm text-slate-600 bg-slate-100">
            No avatar
          </div>
        )}
      </div>
      <div className="font-semibold">{name || "Your Name"}</div>
    </div>

    {/* Buttons */}
    <div className="flex flex-col gap-2 w-full">
      {/* Change Avatar */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className="w-full px-4 py-2 bg-slate-200 rounded-md text-sm hover:bg-slate-300 transition-colors duration-200"
      >
        {isPending ? "Uploading…" : "Change Avatar"}
      </button>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onChange} />

      {/* Change Name */}
      {editingName ? (
        <div className="flex flex-col gap-2 w-full">
          <input
            value={name}
            type="text"
            className="border rounded p-2 w-full"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          <div className="flex gap-2 w-full">
            <button
              onClick={handleChangeName}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              Save
            </button>
            <button
              onClick={() => setEditingName(false)}
              className="flex-1 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setEditingName(true)}
          className="w-full px-4 py-2 bg-slate-200 rounded-md text-sm hover:bg-slate-300 transition-colors duration-200"
        >
          Change Name
        </button>
      )}
    </div>
  </div>
  )
}
