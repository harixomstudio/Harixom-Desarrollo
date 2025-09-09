import { createFileRoute } from "@tanstack/react-router";
import AIChallengePage from "../components/pages/AIChallengePage";

export const Route = createFileRoute("/AIChallenge")({
  component: AIChallengePage,
});

function RouteComponent() {
  return <div>Hello "/AIChallenge"!</div>;
}
