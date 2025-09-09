import { createFileRoute } from "@tanstack/react-router";
import AIChallenge from "../components/pages/AIChallenge";

export const Route = createFileRoute("/AIChallenge")({
  component: AIChallenge,
});

function RouteComponent() {
  return <div>Hello "/AIChallenge"!</div>;
}
