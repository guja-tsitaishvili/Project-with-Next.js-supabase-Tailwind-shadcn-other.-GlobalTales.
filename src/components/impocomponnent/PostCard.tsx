// components/PostCard.tsx
'use client'

import { FC } from 'react'
import Link from 'next/link'

type PostCardProps = {
  id: string
  url: string
  title?: string | null
  description?: string | null
  location?: string | null
  created_at: string
  authorName?: string | null
  avatarUrl?: string | null
  userId: string                    // <-- add this
}

const PostCard: FC<PostCardProps> = ({
  id, url, title, description, location, created_at, authorName, avatarUrl, userId
}) => {
  return (
    <div  >
      <div className="inline-flex items-center gap-2">
        <Link href={`/dashboard/userprofile/${userId}`}>
              {avatarUrl
                ? <img src={avatarUrl} alt="Author" className="h-8 w-8 rounded-full object-cover ring-1 ring-black/10 border border-slate-300/20 dark:border-white/10" />
                : <div className="h-6 w-6 rounded-full bg-slate-200 ring-1 ring-black/10" />
              }
            </Link>
             {authorName && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">{authorName}</span>
          </div>
        )}
        </div>

      <Link href={`/dashboard/${id}`} scroll={false} prefetch={false}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={title ?? 'Post image'}
          className="aspect-square w-full  object-cover"
        />
      </Link>

      <div className="mt-3 space-y-1">
        {title && <h3 className="font-medium">{title}</h3>}
        {location && <p className="text-xs text-slate-500">📍 {location}</p>}
        {description && <p className="text-sm text-slate-700">{description}</p>}
        <p className="text-xs text-slate-400">{new Date(created_at).toLocaleString()}</p>
      </div>
    </div >
  )
}

export default PostCard
