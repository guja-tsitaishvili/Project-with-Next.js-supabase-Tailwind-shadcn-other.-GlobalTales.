import { useContext, type ContextType } from 'react'
import { AuthContext } from '@/components/ui/context/AuthProvider'

const useAuth = (): ContextType<typeof AuthContext> => {
  const context = useContext(AuthContext)

  return context
}

export default useAuth