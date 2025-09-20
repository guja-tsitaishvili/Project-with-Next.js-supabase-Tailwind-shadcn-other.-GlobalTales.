'use client'

import type { ReactNode } from 'react'
import { AuthProvider } from '@/components/ui/context/AuthProvider'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}