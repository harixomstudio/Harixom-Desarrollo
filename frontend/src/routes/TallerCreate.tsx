import { createFileRoute } from "@tanstack/react-router";
import TallerCreatePage from "../components/pages/TallersCreatePage";

export const Route = createFileRoute("/TallerCreate")({
  component: RouteComponent,
});

function RouteComponent() {
  return <TallerCreatePage title="Create Workshop" />;
}