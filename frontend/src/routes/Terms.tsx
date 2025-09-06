import { createFileRoute } from "@tanstack/react-router";
import TermsAndConditions from "../components/pages/TermsAndConditions";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/Terms")({
  component: TermsRoute,
});

function TermsRoute() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    navigate({ to: "/Landing" }); // o la ruta que quieras después de aceptar
  };

  return (
    <TermsAndConditions
      title="Términos y Condiciones"
      onAccept={handleAccept}
    />
  );
}
