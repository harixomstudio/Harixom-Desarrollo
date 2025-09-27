import { createFileRoute } from "@tanstack/react-router";
import Home from "../components/pages/IndexPage";

export const Route = createFileRoute("/")({
  component: HomeRoute,
});

function HomeRoute() {
  return <Home subtitle="“Tu arte, tu espacio protegido”" title="HARIXOM" />;
}
