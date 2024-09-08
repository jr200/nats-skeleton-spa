import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

type Config = Record<string, any>

const ConfigContext = createContext<Config | null>(null)

export const useStaticConfig = (): Config | null => {
  return useContext(ConfigContext)
}

interface StaticConfigProviderProps {
  children: ReactNode
}

export const StaticConfigProvider: React.FC<StaticConfigProviderProps> = ({
  children,
}) => {
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/config.json')
      .then((response) => response.json())
      .then((data) => {
        setConfig(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load static configuration:', error)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading configuration...</div>
  if (!config) return <div>Error loading configuration.</div>

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}
