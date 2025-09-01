import type React from "react";
import { createFileRoute } from "@tanstack/react-router";
import Profile from "../components/pages/Profile";

export const Route = createFileRoute("/Profile")({
  component: ProfileRoute,
});

function ProfileRoute() {
  return (
    <Profile
      username="ZoeKraft"
      followers={100}
      address="Dreamland Street"
      description="is simply dummy text of the printing and typesetting industry."
      cards={[
        { description: "is simply dummy text of the printing and typesetting industry." },
        { description: "is simply dummy text of the printing and typesetting industry." },
        { description: "is simply dummy text of the printing and typesetting industry." },
        { description: "is simply dummy text of the printing and typesetting industry." },
        { description: "is simply dummy text of the printing and typesetting industry." },
        { description: "is simply dummy text of the printing and typesetting industry." },
        { description: "is simply dummy text of the printing and typesetting industry." },
        { description: "is simply dummy text of the printing and typesetting industry." },
        { description: "is simply dummy text of the printing and typesetting industry." },
      ]}
    />
  );
}