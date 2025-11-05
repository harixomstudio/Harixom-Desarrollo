import { createFileRoute } from '@tanstack/react-router'
import ChangePasswordPage from '../components/pages/ChangePasswordPage'

export const Route = createFileRoute('/ChangePassword')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ChangePasswordPage
    title="Change Password"
    gmail="Gmail"
    old_password="Old Password"
    new_password="New Password"
    confirmPassword="Confirm Password"
    buttonText="CHANGE PASSWORD"
     />  
}
