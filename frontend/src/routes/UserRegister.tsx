import type React from "react";
import { createFileRoute } from "@tanstack/react-router";
import UserRegister from "../components/pages/UserRegister";

export const Route = createFileRoute("/UserRegister")({
  component: UserRegisterRoute,
});

function UserRegisterRoute() {
  return <UserRegister
  title="User Register"
  />;
}