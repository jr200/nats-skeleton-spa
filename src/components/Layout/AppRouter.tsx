import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { NavBarLayout } from './NavBarLayout'
import { PlainLayout } from './PlainLayout'
import { ProtectedRoute } from '../auth/ProtectedRoute'
import { useAuth } from '../Providers'
import { UserManager } from 'oidc-client-ts'

import Callback from '../auth/Callback'
import Dashboard from '@/pages/Dashboard'
import Login from '../auth/Login'
import Nats from '@/pages/Nats'
import NatsPubSubExample from '@/pages/NatsPubSubExample'
import Settings from '@/pages/Settings'
import NatsRequestReplyExample from '@/pages/NatsRequestReplyExample'

export function AppRouter() {
  const {
    authenticated,
    setAuthenticated,
    handleLogin,
    handleLogout,
    userManager,
  } = useAuth()

  const router = createBrowserRouter([
    {
      element: <PlainLayout />,
      children: [
        {
          path: '/',
          element: (
            <Login handleLogin={handleLogin} authenticated={authenticated} />
          ),
        },
        {
          path: '/callback',
          element: (
            <Callback
              authenticated={authenticated as boolean}
              setAuth={setAuthenticated}
              handleLogout={handleLogout}
              userManager={userManager as UserManager}
            />
          ),
        },
      ],
    },
    {
      element: <NavBarLayout />,
      children: [
        {
          path: '/dashboard',
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: '/nats',
          element: (
            <ProtectedRoute>
              <Nats />
            </ProtectedRoute>
          ),
        },
        {
          path: '/pubsub',
          element: (
            <ProtectedRoute>
              <NatsPubSubExample />
            </ProtectedRoute>
          ),
        },
        {
          path: '/reqrep',
          element: (
            <ProtectedRoute>
              <NatsRequestReplyExample />
            </ProtectedRoute>
          ),
        },
        {
          path: '/settings',
          element: (
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          ),
        },
        {
          path: '*',
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ])

  return (
    <header className="">
      <RouterProvider router={router} />
    </header>
  )
}
