import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import Nav from '../components/Nav'


export const Route = createRootRoute({
  component: RootComponent,
})

const list = ['Featured', 'Courses', 'Commissions', 'Artistis Feed']
const reference = ['/about', '/contact', '/SetProfile', '/index', '/login']

function RootComponent() {
  return (
    <React.Fragment>
      <Nav list={list} reference={reference} />
      <Outlet />
    </React.Fragment>
  )
}
