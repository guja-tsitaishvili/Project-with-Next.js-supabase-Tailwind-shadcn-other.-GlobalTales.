'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, useTransition, ChangeEvent } from 'react'
import client from '@/api/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function UploadAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  // Load current avatar on mount
  useEffect(() => {
    void (async () => {
      const { data: { user } } = await client.auth.getUser()
      if (!user) return

      const { data: profile } = await client
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single()

      if (profile?.avatar_url) {
        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_avatars/${profile.avatar_url}`
        setAvatarUrl(publicUrl)
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

      // fixed key so you always overwrite the same avatar
      const path = `${user.id}/avatar.${file.name.split('.').pop() || 'jpg'}`

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

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_avatars/${path}`
      setAvatarUrl(publicUrl)
      toast.success('Avatar updated!')
    })
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

        <div className="flex flex-col gap-2">
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={onChange} />
          <Button
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
          >
            {isPending ? 'Uploading…' : 'Upload new avatar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
