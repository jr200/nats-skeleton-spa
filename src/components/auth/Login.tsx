import { Navigate } from 'react-router-dom'
import { Button } from '../ui/button'

interface Props {
  handleLogin: () => void
  authenticated: boolean | null
}

const Login: React.FC<Props> = ({ authenticated, handleLogin }) => {
  return (
    <div>
      {authenticated === null && <div>Loading...</div>}
      {authenticated === false && (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-balance text-muted-foreground">
                  You will be redirected to the login provider.
                </p>
              </div>
              <div className="grid gap-4">
                <Button className="w-full" onClick={handleLogin}>
                  Login
                </Button>
              </div>
            </div>
          </div>
          <div className="hidden bg-muted lg:block">
            <img
              src="/vite.svg"
              alt="Image"
              width="1920"
              height="1080"
              className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </div>

        // <div>
        //   <button onClick={handleLogin}>Login</button>
        // </div>
      )}
      {authenticated && <Navigate to="/callback" />}
    </div>
  )
}

export default Login
