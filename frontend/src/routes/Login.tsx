import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "../components/pages/LoginPage";

export const Route = createFileRoute("/Login")({
  component: LoginRoute,
});

function LoginRoute() {
  return (
    <LoginPage
      title="Login"
      email="Email"
      password="Password"
      text="Don't have an account?"
      link="Sign Up"
    />
  );

}
