'use client'
import { createContext, useEffect, useState, type ReactNode } from 'react'
import client from '@/api/client'
import type { User } from '@supabase/supabase-js'

type AuthContextValue = {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true })

type AuthProviderProps = { children: ReactNode }

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // initial session
    client.auth.getSession().then(({ data }) => {
       setUser(data?.session?.user ?? null)
       setLoading(false)
    });

    // subscribe to auth changes
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
  
      setUser(session?.user ?? null)
  // optional: setLoading(false) here too
})

return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
