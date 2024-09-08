import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

// Define a type for the props
interface NavLinkProps {
  to: string
  label: string
  icon?: ReactNode // Optional ReactNode type for icon
  className?: string // Optional string type for className
  srOnly?: string // Optional string type for screen-reader text
}

const NavLink: React.FC<NavLinkProps> = ({
  to,
  label,
  icon,
  className = '',
  srOnly = '',
}) => {
  return (
    <Link to={to} className={`flex items-center gap-2 ${className}`}>
      {icon}
      {srOnly ? <span className="sr-only">{srOnly}</span> : label}
    </Link>
  )
}

export default NavLink
