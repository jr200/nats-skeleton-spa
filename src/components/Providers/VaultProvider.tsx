import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useAuth, useSessionStorage } from '../Providers'
import { dictNestedValue } from '@/lib/utils'

// Define types and interfaces
interface VaultContextProps {
  vaultAuthenticated: boolean
  vaultRead: (path: string, key: string) => Promise<any>
  vaultLogout: () => void
}

interface VaultProviderProps {
  children: ReactNode
}

const vaultConfig = {
  uri: '', // import.meta.env.VITE_VAULT_URI,
  loginPath: '', // import.meta.env.VITE_VAULT_PATH_LOGIN,
}

const VaultContext = createContext<VaultContextProps | undefined>(undefined)

const VAULT_STORAGE_PREFIX = '$VS:'

export function VaultProvider({ children }: VaultProviderProps) {
  const [clientToken, setClientToken] = useState<string | undefined>(undefined)
  const { authenticated, userInfo } = useAuth()
  const { setItemWithPrefix, getItemWithPrefix, clearItemsWithPrefix } =
    useSessionStorage() // Destructure methods from useSessionStorage

  const vaultAuthenticated = Boolean(clientToken)
  const vaultLoginUrl = `${vaultConfig.uri}/v1/${vaultConfig.loginPath}`

  useEffect(() => {
    if (!authenticated || !userInfo?.id_token) {
      setClientToken(undefined)
      return // Exit early if not authenticated or no user token
    }

    authenticateWithVault(userInfo.id_token)
  }, [authenticated, userInfo])

  const authenticateWithVault = async (idToken: string) => {
    try {
      console.log('authenticating with vault', vaultLoginUrl, idToken)
      const response = await fetch(vaultLoginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwt: idToken }),
      })

      if (!response.ok) {
        throw new Error(
          `Failed to authenticate with Vault: ${response.statusText}`
        )
      }

      const loginData = await response.json()
      console.log(
        'retrieved vault user-policies: ',
        loginData.auth.policies.join(', ')
      )

      setClientToken(loginData.auth.client_token)
    } catch (error) {
      setClientToken(undefined)
      if (error instanceof Error) {
        console.error(`Authentication error: ${error.message}`)
      } else {
        console.error('An unknown error occurred during authentication')
      }
    }
  }

  const ensureAuthenticated = async () => {
    if (!clientToken && userInfo?.id_token) {
      await authenticateWithVault(userInfo.id_token)
    }
  }

  const vaultLogout = () => {
    setClientToken(undefined)
    clearItemsWithPrefix(VAULT_STORAGE_PREFIX)
  }

  const vaultRead = async (path: string, key: string): Promise<any> => {
    await ensureAuthenticated()

    // Retrieve value using the prefixed key
    const storedValue = getItemWithPrefix(VAULT_STORAGE_PREFIX, path)
    if (storedValue) {
      console.log(`Retrieved value for ${path} from sessionStorage`)
      return storedValue
    }

    if (!clientToken) {
      console.warn('Client is not authenticated')
      return undefined
    }

    try {
      const response = await fetch(`${vaultConfig.uri}/v1/${path}`, {
        method: 'GET',
        headers: {
          'X-Vault-Request': 'true',
          'X-Vault-Token': clientToken,
        },
      })

      if (!response.ok) {
        console.error(
          `Failed to retrieve value from path ${path}: ${response.statusText}`
        )
        return undefined
      }

      const rawData = await response.json()
      const keyPathParts = ['data', ...key.split('/')]
      const result = dictNestedValue(rawData, keyPathParts)

      // Store the value in sessionStorage using the prefixed path as the key
      setItemWithPrefix(VAULT_STORAGE_PREFIX, path, result)
      return result
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Error reading from Vault for path ${path}: ${error.message}`
        )
      } else {
        console.error('An unknown error occurred while reading from Vault')
      }
      return undefined
    }
  }

  return (
    <VaultContext.Provider
      value={{
        vaultAuthenticated,
        vaultRead,
        vaultLogout,
      }}
    >
      {children}
    </VaultContext.Provider>
  )
}

export function useVault() {
  const context = useContext(VaultContext)
  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider')
  }
  return context
}
