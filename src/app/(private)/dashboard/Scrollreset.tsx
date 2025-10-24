// app/(private)/dashboard/ScrollReset.tsx
'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function ScrollReset() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    // Instant jump to top on (first) mount or route/search change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, searchParams])

  return null
}
