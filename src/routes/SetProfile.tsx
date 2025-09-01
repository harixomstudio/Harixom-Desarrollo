import { createFileRoute } from '@tanstack/react-router'
import SetProfilePage from '../components/pages/SetProfilePage'

export const Route = createFileRoute('/SetProfile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SetProfilePage
    title="Profile"
    name="Name"
    email="Email"
    phone="Phone"
    address="Address"
    link="Reset Password"
  />;
}
