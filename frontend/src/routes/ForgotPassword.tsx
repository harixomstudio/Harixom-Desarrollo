import { createFileRoute } from '@tanstack/react-router'
import ForgotPasswordPage from "../components/pages/ForgotPasswordPage";

export const Route = createFileRoute('/ForgotPassword')({
  component: RouteComponent,
})

function RouteComponent() {
  return  <ForgotPasswordPage
      title="Forgot Password"
      email="Email"
      buttonText="SEND RESET LINK"
      successMessage="Correo de recuperación enviado"
    />
}
