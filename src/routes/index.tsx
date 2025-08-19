import { createFileRoute } from "@tanstack/react-router";
import Home from "../components/pages/Index";

export const Route = createFileRoute("/")({
  component: HomeRoute,
});

function HomeRoute() {
  return (
    <Home
      subtitle="Welcome to"
      title="HARIXOM"
    />
  );
}
