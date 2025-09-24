'use client'

import { Button } from '@/components/ui/button'
import client from '@/api/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignOutButton() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const handleSignOut = async () => {
    try {
      setBusy(true)
      // 1) Clear browser session
      await client.auth.signOut()

      // 2) Clear server-side cookies so SSR no longer sees a session
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'SIGNED_OUT' }),
      })

      if (!res.ok) {
        console.error('Failed to clear server cookies:', await res.text().catch(() => ''))
      }

      // 3) Navigate away and re-run server components
      router.replace('/')
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button onClick={handleSignOut} disabled={busy}>
      {busy ? 'Signing out…' : 'Sign out'}
    </Button>
  )
}
