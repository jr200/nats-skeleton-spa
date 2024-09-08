import React, { createContext, useContext, useState, useEffect } from 'react'
import { UserManager, User } from 'oidc-client-ts'
import { createZitadelAuth, ZitadelConfig } from '@zitadel/react'

export const authConfig: ZitadelConfig = {
  authority: import.meta.env.VITE_AUTHORITY,
  client_id: import.meta.env.VITE_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  response_type: import.meta.env.VITE_RESPONSE_TYPE,
  scope: import.meta.env.VITE_SCOPE,
  post_logout_redirect_uri: import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI,
}

interface AuthContextProps {
  authenticated: boolean | null
  userManager: UserManager | null
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>
  userInfo: User | null
  handleLogout: () => Promise<void>
  handleLogin: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)
const zitadel = createZitadelAuth(authConfig)

export function AuthProvider({ children }: any) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const [userManager, setUserManager] = useState<UserManager | null>(
    zitadel.userManager as unknown as UserManager
  )

  useEffect(() => {
    handleAuthentication()
  }, [authenticated, userInfo])

  async function handleAuthentication() {
    if (authenticated === null) {
      try {
        const user: User = (await zitadel.userManager.getUser()) as User
        if (user) {
          setAuthenticated(true)
          setUserInfo(user)
          setUserManager(zitadel.userManager as unknown as UserManager)
        } else {
          setAuthenticated(false)
        }
      } catch (error) {
        setAuthenticated(false)
      }
    }

    if (authenticated === true && userInfo === null) {
      try {
        const user: User = (await zitadel.userManager.getUser()) as User
        if (user) {
          setAuthenticated(true)
          setUserInfo(user)
          setUserManager(zitadel.userManager as unknown as UserManager)
        } else {
          setAuthenticated(false)
        }
      } catch (error) {
        setAuthenticated(false)
      }
    }
  }

  async function handleLogout() {
    await zitadel.signout()
    setAuthenticated(false)
    setUserInfo(null)
    setUserManager(null)
  }

  function handleLogin() {
    zitadel.authorize()
  }

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        userInfo,
        handleLogout,
        handleLogin,
        userManager,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
