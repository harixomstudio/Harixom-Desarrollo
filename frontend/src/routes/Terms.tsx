import { createFileRoute } from "@tanstack/react-router";
import TermsAndConditions from "../components/pages/TermsAndConditionsPage";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/Terms")({
  component: TermsRoute,
});

function TermsRoute() {
  const navigate = useNavigate();
  const [, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    navigate({ to: "/Landing" }); // o la ruta que quieras después de aceptar
  };

  return (
    <TermsAndConditions
      title="Terms and Conditions"
      onAccept={handleAccept}
    />
  );
}
