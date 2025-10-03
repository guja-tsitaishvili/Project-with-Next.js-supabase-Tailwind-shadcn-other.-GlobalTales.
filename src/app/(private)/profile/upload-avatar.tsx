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
    <div className="space-y-4">
      <div className="flex items-center gap-4">
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

        <div className="flex flex-row gap-2">
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={onChange} />
          <Button
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
          >
            {isPending ? 'Uploading…' : 'Upload new avatar'}
          </Button>

          <div className="gap-2">
            {editingName ? (<>
            <input value={name} type="text" className="border rounded p-2" onChange={(e) => setName(e.target.value)} placeholder="Enter your name"/>
            <Button onClick={handleChangeName}>
             save
          </Button>
          <Button variant="secondary" onClick={() => setEditingName(false)}>
        Cancel
      </Button>
      </>
          ) 
          : 
          (
            <Button onClick={() => setEditingName(true)}>
             Change Name
            </Button>
          )
        }
          </div>
        </div>
      </div>
    </div>
  )
}
