
import { createFileRoute } from "@tanstack/react-router";
import Feed from "../components/pages/FeedPage";

export const Route = createFileRoute("/Feed")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Feed
      
    />
  );

}
