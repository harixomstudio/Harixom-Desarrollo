import { createFileRoute } from "@tanstack/react-router";
import RegisterPage from "../components/pages/RegisterPage";

export const Route = createFileRoute("/Register")({
  component: RegisterRoute,
});

function RegisterRoute() {
  return (
    <RegisterPage
      title="Register"
      name="Name"
      email="Email"
      phone="Phone"
      address="Address"
      password="Password"
      confirmPassword="Confirm Password"
      text="Already have an account ?"
      link="Login Up"
    />
  );
}
