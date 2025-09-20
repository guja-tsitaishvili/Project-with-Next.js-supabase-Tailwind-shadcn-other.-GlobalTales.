'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import client from '@/api/client' // <-- make sure this path matches your client file

const Dashboard: React.FC = () => {
  const handleSignOut = async () => {
    await client.auth.signOut()
    // optionally: redirect after sign-out
    // window.location.href = '/'
  }

  return (
    <div>
      <h1>This is dashboard</h1>
      <Button onClick={handleSignOut}>Sign out</Button>
    </div>
  )
}

export default Dashboard
