import { useState } from "react";
import axios from "axios";

export default function AIChallenge() {
  const [specialty, setSpecialty] = useState(""); // Especialidad del usuario
  const [challenge, setChallenge] = useState<{
    reto: string;
    pasos: string[];
    nota: string;
  } | null>(null); // Objeto con el reto parseado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false); // 🔒 Nuevo estado

  const handleGetChallenge = async () => {
    if (!specialty.trim()) return alert("Escribe tu especialidad primero.");

    setLoading(true);
    setError("");
    setChallenge(null);
    setButtonDisabled(true); // 🔒 Bloquea el botón al iniciar la solicitud

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

      // Limpieza por si viene con ```json ... ```
      let raw = response.data.challenge;
      const cleaned = raw
        .replace(/```json/i, "")
        .replace(/```/g, "")
        .trim();

      // Intentamos parsear la respuesta JSON que devuelve la IA
      const data = JSON.parse(cleaned);

      setChallenge({
        reto: data.reto,
        pasos: data.pasos,
        nota: data.nota,
      });
    } catch (err: any) {
      console.error("Error:", err);
      setError("Error al obtener o procesar el reto.");
      setButtonDisabled(false); // 🔓 Rehabilita el botón si hubo error
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecialty(e.target.value);
    setButtonDisabled(false); // 🔓 Permite pedir otro reto si cambia la especialidad
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">IA Challenge</h1>

      <input
        type="text"
        placeholder="Escribe tu especialidad (ej: dibujante)"
        value={specialty}
        onChange={handleSpecialtyChange}
        className="mb-4 px-4 py-2 rounded w-full max-w-md text-white bg-stone-800"
      />

      <button
        onClick={handleGetChallenge}
        className={`mb-6 px-6 py-2 rounded font-semibold transition-all ${
          loading || buttonDisabled
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-pink-500 hover:bg-pink-600"
        }`}
        disabled={loading || buttonDisabled}
      >
        {loading ? "Cargando..." : buttonDisabled ? "Reto generado ✅" : "Obtener Reto"}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {challenge && (
        <div className="bg-stone-800 p-6 rounded max-w-md w-full text-gray-200">
          <h2 className="text-xl font-bold mb-2">Tu reto:</h2>
          <p className="mb-4">{challenge.reto}</p>

          <h3 className="font-semibold mb-2">Pasos:</h3>
          <ol className="list-decimal list-inside space-y-1 mb-4">
            {challenge.pasos.map((paso, index) => (
              <li key={index}>{paso}</li>
            ))}
          </ol>

          <p className="text-pink-400 font-medium text-center mt-4">
            {challenge.nota}
          </p>
        </div>
      )}
    </div>
  );
}
