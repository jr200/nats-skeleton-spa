import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

import { credsAuthenticator, type NatsConnection } from '@nats-io/nats-core'
import { Base64Codec, wsconnect } from '@nats-io/transport-node'
import { type User } from 'oidc-client-ts'

import { useAuth } from '@/components/Providers'

const natsWsEndpoint = import.meta.env.VITE_NATS_ENDPOINT
const natsUserCredsB64 = import.meta.env.VITE_NATS_NOBODY_CREDS_B64

// Define the context interface
interface NatsContextProps {
  nats: NatsConnection | null
  isConnected: boolean
}

// Create context
const NatsContext = createContext<NatsContextProps | undefined>(undefined)

// NatsProvider Props
interface NatsProviderProps {
  children: ReactNode
}

async function connectToNats(
  endpoint: string,
  user: User | null,
  sentinelCreds: string
): Promise<NatsConnection | undefined> {
  try {
    console.log('Connecting to NATS:', endpoint)

    // Prepare user credentials
    const b64email = user?.profile?.email ? btoa(user.profile.email) : ''
    const token = user?.id_token || ''

    // Establish connection to NATS server
    const client = await wsconnect({
      servers: [endpoint],
      authenticator: credsAuthenticator(
        new TextEncoder().encode(sentinelCreds)
      ),
      user: b64email,
      pass: token,
      debug: true,
      // maxReconnectAttempts: 5,
    })

    console.log('Connected to', client.getServer())
    return client
  } catch (error) {
    console.error('Failed to connect:', error)
    return undefined
  }
}

// NatsProvider component
export function NatsProvider({ children }: NatsProviderProps) {
  const { authenticated, userInfo } = useAuth()
  const sentinelCredentials = Base64Codec.decode(natsUserCredsB64) as string
  const [nats, setNats] = useState<NatsConnection | null>(null)

  useEffect(() => {
    if (!authenticated) return

    // Automatically establish a connection to NATS
    connectToNats(natsWsEndpoint, userInfo, sentinelCredentials).then(
      (connection) => {
        if (connection) setNats(connection)
      }
    )

    return disconnectFromNats
  }, [authenticated, natsWsEndpoint, userInfo])

  if (!natsUserCredsB64) {
    console.error('undefined environment variable VITE_NATS_NOBODY_CREDS_B64')
    return null
  }

  const disconnectFromNats = () => {
    if (nats) {
      nats.drain()
      setNats(null)
      console.log('closed NATS connection')
    }
  }

  return (
    <NatsContext.Provider
      value={{
        nats,
        isConnected: !!nats,
      }}
    >
      {children}
    </NatsContext.Provider>
  )
}

// Custom hook to use NatsContext
export function useNats() {
  const context = useContext(NatsContext)
  if (context === undefined) {
    throw new Error('useNats must be used within a NatsProvider')
  }
  return context
}
