import { createFileRoute } from "@tanstack/react-router";
import AIChallenge from "../components/pages/AIChallengePage";

export const Route = createFileRoute("/AIChallenge")({
  component: AIChallenge,
});

