import { createFileRoute } from "@tanstack/react-router";
import Register from "../components/pages/RegisterPage";


export const Route = createFileRoute("/Register")({
  component: RegisterRoute,
});

function RegisterRoute() {
  return (
    <Register
      title="Register"
      name="User name"
      email="Email"
      phone="Phone"
      address="Address"
      password="Password"
      confirmPassword="Confirm Password"
      text="Already have an account?"
      link="Login"
    />
  );
}
