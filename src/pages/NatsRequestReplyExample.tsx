import { useEffect } from 'react'
import { useNatsSubject } from '@/components/Providers/NatsSubjectProvider'

const MyRequestReplyComponent = () => {
  const { rxnats } = useNatsSubject()

  useEffect(() => {
    if (!rxnats) {
      return
    }

    // Create a new NATS subject for requests
    const requestSubject = rxnats.subject<string, string>({
      name: 'service.request',
    })

    // Subscribe to the subject and handle requests
    const subscription = requestSubject.hot.subscribe({
      next: (msg) => {
        console.log('Received request:', msg.data)
        if (msg.reply) {
          // Respond to the request
          msg.reply.publish('This is the response to your request.')
        }
      },
      error: (err) => console.error('Error in request subscription:', err),
    })

    // Send a request
    const responseSubject = requestSubject.request('Can I get a response?')
    responseSubject.hot.subscribe({
      next: (response) => console.log('Received response:', response.data),
    })

    // Clean up the subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [rxnats])

  return (
    <>
      <div>Request-Reply Example</div>
    </>
  )
}

export default MyRequestReplyComponent
