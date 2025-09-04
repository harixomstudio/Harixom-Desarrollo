import * as React from 'react'
import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import Nav from '../components/Nav'
import EventsNav from '../components/EventsNav'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const currentPath = location.pathname


  const listEvents= ['Events', 'Workshop', 'Challenges']
  const referenceEvents = ['/Events', '/Workshops', '/Challenges']
  const hideEventsNav = ['/Feed', '/Login', '/Register', '/RegisterAdmin', '/ForgotPassword', '/Landing', '/'].includes(currentPath);

  // Rutas donde NO quieres mostrar el Nav
  const hideNav = ['/','/Register', '/Login', '/ForgotPassword', '/ResetPassword', '/SetProfile', '/CreatePublication'].includes(currentPath)

  return (
    <React.Fragment>
      {!hideNav && <Nav list={['Feed', 'Create']} reference={['/Feed', '/CreatePublication']} />}
       {/* {!hideNav && <Nav list={[ 'About', 'Contact']} reference={['/about', '/contact']} />} */}
      <div className="flex min-h-screen">
        {!hideEventsNav && (<EventsNav listEvents={listEvents} referenceEvents={referenceEvents} />)}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </React.Fragment>
  )
}