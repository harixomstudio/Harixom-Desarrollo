<<<<<<< HEAD
import type React from "react";
import { createFileRoute } from "@tanstack/react-router";
import Login from "../components/pages/Login";

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
=======
import { createFileRoute } from '@tanstack/react-router'
import Login from '../components/pages/Login'

export const Route = createFileRoute('/Login')({
    component: RouteComponent,
})

function RouteComponent() {
    return <Login
      textbutton="Get started"
    ></Login>
>>>>>>> ee27dbae5edeb064fd96b9823f1c92f91d4af574
}
