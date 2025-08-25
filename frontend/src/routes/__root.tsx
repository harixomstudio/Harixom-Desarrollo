import * as React from 'react'
import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import Nav from '../components/Nav'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const currentPath = location.pathname

  // Rutas donde NO quieres mostrar el Nav
  const hideNav = ['/','/Register', '/Login', '/ForgotPassword', '/ResetPassword', '/SetProfile'].includes(currentPath)

  return (
    <React.Fragment>
      {!hideNav && <Nav list={[]} reference={[]} />}
       {/* {!hideNav && <Nav list={[ 'About', 'Contact']} reference={['/about', '/contact']} />} */}
      <Outlet />
    </React.Fragment>
  )
}