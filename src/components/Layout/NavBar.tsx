import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Menu, Package2, Search } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '../Providers'
import { UserProfileMenu } from '../auth/UserProfileMenu'
import NavLink from './NavLink'

const navItems = [
  {
    to: '/',
    label: 'Acme Inc',
    icon: <Package2 className="h-6 w-6" />,
    srOnly: 'Acme Inc',
    showOnDesktop: true,
    showOnMobile: true,
  },
  {
    to: '/nats',
    label: 'Nats',
    showOnMobile: true,
    showOnDesktop: true,
    requiresAuth: true,
  },
  {
    to: '/pubsub',
    label: 'NatsPubSub',
    showOnMobile: true,
    showOnDesktop: true,
    requiresAuth: true,
  },
  {
    to: '/reqrep',
    label: 'NatsReqRep',
    showOnMobile: true,
    showOnDesktop: true,
    requiresAuth: true,
  },
  {
    to: '/dashboard',
    label: 'Dashboard',
    showOnMobile: true,
    showOnDesktop: true,
    requiresAuth: true,
  },
  // { to: '#', label: 'Orders', showOnMobile: true },
  // { to: '#', label: 'Products', showOnMobile: true },
  // { to: '#', label: 'Customers', showOnMobile: true },
  {
    to: '/settings',
    label: 'Settings',
    showOnDesktop: true,
    showOnMobile: true,
    requiresAuth: true,
  },
]

export function NavBar() {
  const { authenticated } = useAuth()

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Desktop Navigation */}
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        {navItems
          .filter(
            (item) =>
              item.showOnDesktop && (!item.requiresAuth || authenticated)
          )
          .map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              label={item.label}
              icon={item.icon}
              srOnly={item.srOnly}
              className={
                item.icon
                  ? 'text-lg font-semibold md:text-base'
                  : 'text-muted-foreground transition-colors hover:text-foreground'
              }
            />
          ))}
      </nav>

      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            {navItems
              .filter(
                (item) =>
                  item.showOnMobile && (!item.requiresAuth || authenticated)
              )
              .map((item, index) => (
                <NavLink
                  key={index}
                  to={item.to}
                  label={item.label}
                  className="text-muted-foreground hover:text-foreground"
                />
              ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Right-side Icons and Actions */}
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <UserProfileMenu />
      </div>
    </header>
  )
}
