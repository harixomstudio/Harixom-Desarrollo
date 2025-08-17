import { createFileRoute } from '@tanstack/react-router'
import Login from '../components/pages/Login'

export const Route = createFileRoute('/Login')({
    component: RouteComponent,
})

function RouteComponent() {
    return <Login
      textbutton="Get started"
    ></Login>
}
