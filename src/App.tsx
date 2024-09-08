import {
  AuthProvider,
  SessionStorageProvider,
  NatsProvider,
  NatsSubjectProvider,
} from './components/Providers'
import { AppRouter } from './components/Layout/AppRouter'

function App() {
  return (
    <>
      <AuthProvider>
        <SessionStorageProvider>
          <NatsProvider>
            <NatsSubjectProvider>
              <AppRouter />
            </NatsSubjectProvider>
          </NatsProvider>
        </SessionStorageProvider>
      </AuthProvider>
    </>
  )
}

export default App
