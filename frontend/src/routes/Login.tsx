import { createFileRoute } from "@tanstack/react-router";
import Login from "../components/pages/LoginPage";

export const Route = createFileRoute("/Login")({
  component: LoginRoute,
});

function LoginRoute() {
  return (
    <Login
      title="Login"
      email="Email"
      password="Password"
      text="Don't have an account?"
      link="Sign Up"
    />
  );
}
