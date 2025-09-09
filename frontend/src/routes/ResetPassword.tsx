import { createFileRoute } from "@tanstack/react-router";
import ResetPassword from "../components/pages/ResetPassword";

export const Route = createFileRoute("/ResetPassword")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ResetPassword
      title="Reset Password"
      password="New Password"
      confirmPassword="Confirm Password"
      buttonText="RESET PASSWORD"
    />
  );
}
