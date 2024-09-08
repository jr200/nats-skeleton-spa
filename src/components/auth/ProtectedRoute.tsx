import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Providers'
import { useEffect, ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate()
  const { authenticated, userInfo } = useAuth()

  useEffect(() => {
    if (authenticated === null) return
    if (!authenticated || !userInfo) {
      navigate('/')
    }
  }, [authenticated, userInfo, navigate])

  if (!authenticated || !userInfo) {
    return <div>Redirecting...</div>
  }

  return <>{children}</>
}
