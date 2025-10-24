import { createFileRoute } from "@tanstack/react-router";
import EventsCreatePage from "../components/pages/EventsCreatePage";

export const Route = createFileRoute("/EventsCreate")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EventsCreatePage title="Create Event" />;
}