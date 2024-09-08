import { useNats } from '@/components/Providers'

export default function Nats() {
  const { nats } = useNats()

  return (
    <div className="grid min-h-screen w-full grid-cols-1 overflow-hidden bg-red-300">
      <div>
        {nats ? (
          <h1>Connected to {nats?.getServer()}</h1>
        ) : (
          <h1>Connecting to NATS...</h1>
        )}
        Client Id: {nats?.info?.client_id}
      </div>
    </div>
  )
}
