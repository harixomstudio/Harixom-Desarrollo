import { createFileRoute } from "@tanstack/react-router";
import ForgotPassword from "../components/pages/ForgotPasswordPage";

export const Route = createFileRoute("/ForgotPassword")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ForgotPassword
      title="Forgot Password"
      email="Email"
      buttonText="SEND RESET LINK"
      successMessage="Correo de recuperación enviado"
    />
  );
}
