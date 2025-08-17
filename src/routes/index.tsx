import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="flex flex-col items-center justify-center h-screen gap-4">
    <Link to="/Login" className='text-blue-500 text-4xl '>login</Link>
  </div>
}
