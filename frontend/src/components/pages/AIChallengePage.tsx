import { useState } from "react";
import axios from "axios";

export default function AIChallenge() {
  const [specialty, setSpecialty] = useState(""); // Especialidad del usuario
  const [challenge, setChallenge] = useState(""); // Reto recibido de la IA
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetChallenge = async () => {
    if (!specialty.trim()) return alert("Escribe tu especialidad primero.");

    setLoading(true);
    setError("");
    setChallenge("");

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/ia/challenge",
        { specialty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("Respuesta completa del backend:", response.data);

      setChallenge(response.data.challenge);
    } catch (err: any) {
      console.error("Error en React:", err);
      setError(
        err.response?.data?.error
          ? `${err.response.data.error}${err.response.data.details ? "\n" + err.response.data.details : ""}`
          : "Error al obtener el reto."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">IA Challenge</h1>

      <input
        type="text"
        placeholder="Escribe tu especialidad (ej: dibujante)"
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
        className="mb-4 px-4 py-2 rounded w-full max-w-md text-white bg-stone-800"
      />

      <button
        onClick={handleGetChallenge}
        className="mb-6 bg-pink-500 hover:bg-pink-600 px-6 py-2 rounded font-semibold"
        disabled={loading}
      >
        {loading ? "Cargando..." : "Obtener Reto"}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {challenge && (
        <div className="bg-stone-800 p-6 rounded max-w-md w-full text-gray-200">
          <h2 className="text-xl font-bold mb-2">Tu reto:</h2>
          <p>{challenge}</p>
        </div>
      )}
    </div>
  );
}
