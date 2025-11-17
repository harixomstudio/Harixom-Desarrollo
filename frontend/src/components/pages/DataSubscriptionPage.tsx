import axios from "axios";
import { useEffect, useState } from "react";

export default function DataSubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("No se encontró el token de autenticación.");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/subscriptions", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((res) => setSubscriptions(res.data.subscriptions))
      .catch((err) => {
        console.error("Error al cargar suscripciones:", err);
        if (err.response?.status === 401) {
          setError("Tu sesión ha expirado o no estás autenticado.");
        } else {
          setError("Error al cargar las suscripciones.");
        }
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Mis suscripciones</h1>

      {error ? (
        <p className="text-red-400">{error}</p>
      ) : subscriptions.length === 0 ? (
        <p>No tienes suscripciones registradas.</p>
      ) : (
        <ul className="space-y-4">
          {subscriptions.map((sub) => (
            <li
              key={sub.id}
              className="p-4 border border-gray-700 rounded-lg bg-stone-800"
            >
              <p>
                <strong>Plan:</strong> {sub.plan_type}
              </p>
              <p>
                <strong>Monto:</strong> ${sub.amount} {sub.currency}
              </p>
              <p>
                <strong>Estado:</strong> {sub.status}
              </p>
              <p>
                <strong>Inicio:</strong>{" "}
                {new Date(sub.start_date).toLocaleDateString()}
              </p>
              {sub.end_date && (
                <p>
                  <strong>Fin:</strong>{" "}
                  {new Date(sub.end_date).toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
