import { Outlet } from 'react-router-dom'
import { NavBar } from './NavBar'

export function NavBarLayout() {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </>
  )
}
