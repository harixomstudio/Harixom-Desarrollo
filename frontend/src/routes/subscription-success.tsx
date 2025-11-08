import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useToast } from "../components/ui/Toast";
import { axiosRequest } from "../components/helpers/config";

export const Route = createFileRoute("/subscription-success")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      plan: typeof search.plan === "string" ? search.plan : undefined,
    };
  },
});

function RouteComponent() {
  const { plan } = Route.useSearch();
  const { showToast } = useToast();
  const token = localStorage.getItem("access_token");

  const planText =
    plan === "monthly"
      ? "Monthly Subscription"
      : plan === "annual"
        ? "Annual Subscription"
        : "Subscription";

  const handleEmailConfirmation = async () => {
    if (!token) {
      showToast("Usuario no autenticado. Inicia sesión nuevamente.", "error");
      return;
    }
    try {
      const res = await axiosRequest.post("http://127.0.0.1:8000/api/subscription-success-email",
        {
          plan
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showToast(res.data.message, "success");
    } catch (error: any) {
      showToast(
        error.response?.data?.error || "Error al enviar el correo.",
        "error"
      )
    }
  };

  useEffect(() => {
    handleEmailConfirmation();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-900 text-white p-6">
      <h1 className="text-4xl font-bold text-green-400 mb-4">
        ¡Subscription Successful!
      </h1>

      <p className="text-lg text-gray-300 max-w-md text-center mb-6">
        Your{" "}
        <span className="text-green-400 font-semibold">
          {planText}
        </span>{" "}
        has been successfully activated. Now you have access to advanced
        features such as creating workshops and events.
      </p>

      <a
        href="/Profile"
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        Back to profile
      </a>
    </div>
  );
}

export default RouteComponent;
