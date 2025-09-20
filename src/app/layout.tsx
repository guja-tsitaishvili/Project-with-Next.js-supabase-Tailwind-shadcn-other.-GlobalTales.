
import type { Metadata } from 'next'
import './globals.css'

import ClientProviders from '@/components/ui/providers/ClientProviders'
import {Toaster } from "sonner";

export const metadata: Metadata = {
  title: 'GlobeTales',
  description: 'Travel stories on an interactive map',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
        <Toaster />
      </body>
    </html>
  )
}
