import { createFileRoute } from "@tanstack/react-router";
import SetProfilePage from "../components/pages/SetProfilePage";

export const Route = createFileRoute("/SetProfile")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SetProfilePage />; // No necesitas pasar props estáticos
}
