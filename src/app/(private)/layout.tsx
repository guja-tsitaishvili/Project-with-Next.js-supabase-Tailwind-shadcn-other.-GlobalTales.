'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'

type PrivatePagesLayoutProps = {
  children: ReactNode
}

const PrivatePagesLayout: React.FC<PrivatePagesLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/') // avoid back button returning here
    }
  }, [loading, user, router])

  if (loading || !user) return null

  return <>{children}</>
}

export default PrivatePagesLayout
