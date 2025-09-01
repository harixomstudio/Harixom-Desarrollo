import * as React from 'react'
import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import Nav from '../components/Nav'
import EventsNav from '../components/EventsNav'



export const Route = createRootRoute({
  component: RootComponent,
})

const list = ['Featured', 'Courses', 'Commissions', 'Artistis Feed']
const reference = ['/Profile', '/Landing', '/SetProfile', '/', '/Login']

const listEvents= ['Events', 'Workshop', 'Challenges']
const referenceEvents = ['/Events', '/Workshops', '/Challenges']

function RootComponent() {
  const location = useLocation();
  const currentPath = location.pathname;
  const hideNavRoutes = ['/', '/Login', '/Register', '/RegisterAdmin', '/ForgotPassword'].includes(currentPath);
  const hideEventsNav = ['/Feed', '/Login', '/Register', '/RegisterAdmin', '/ForgotPassword', '/Landing', '/'].includes(currentPath);

  

  return (
    <React.Fragment>
      {!hideNavRoutes && (<Nav list={list} reference={reference} />)}
      <div className="flex min-h-screen">
        {!hideEventsNav && (<EventsNav listEvents={listEvents} referenceEvents={referenceEvents} />)}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </React.Fragment>
  )
}
