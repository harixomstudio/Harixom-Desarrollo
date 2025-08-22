import * as React from 'react'
import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import Nav from '../components/Nav'



export const Route = createRootRoute({
  component: RootComponent,
})

const list = ['Featured', 'Courses', 'Commissions', 'Artistis Feed']
const reference = ['/Profile', '/Landing', '/SetProfile', '/', '/Login']

function RootComponent() {
  const location = useLocation();
  const currentPath = location.pathname;
  const hideNavRoutes = ['/', '/Login', '/Register', '/RegisterAdmin'].includes(currentPath);

  

  return (
    <React.Fragment>
      {!hideNavRoutes && (<Nav list={list} reference={reference} />)}
      <Outlet />
      
    </React.Fragment>
  )
}
