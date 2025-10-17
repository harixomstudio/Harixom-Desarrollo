import { useState } from "react";
import axios from "axios";

export default function AIChallenge() {
  const [specialty, setSpecialty] = useState("");
  const [challenge, setChallenge] = useState<{
    reto: string;
    pasos: string[];
    nota: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleGetChallenge = async () => {
    if (!specialty.trim()) return alert("Escribe tu especialidad primero.");

    setLoading(true);
    setError("");
    setChallenge(null);
    setButtonDisabled(true);

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

      let raw = response.data.challenge;
      const cleaned = raw
        .replace(/```json/i, "")
        .replace(/```/g, "")
        .trim();

      const data = JSON.parse(cleaned);

      setChallenge({
        reto: data.reto,
        pasos: data.pasos,
        nota: data.nota,
      });
    } catch (err: any) {
      console.error("Error:", err);
      setError("Error al obtener o procesar el reto.");
      setButtonDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecialty(e.target.value);
    setButtonDisabled(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-[#0d0d0d] via-[#1a1a1a] to-[#262626] text-white px-6 py-12">
      {/* Encabezado */}
      <div className="max-w-2xl text-center mb-12">
        <h1
          className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-[#F778BD] via-[#A39FF6] to-[#96E2FF] text-transparent bg-clip-text"
          style={{ fontFamily: "Starstruck" }}
        >
          Reto Harixom IA
        </h1>
        <p className="text-gray-300 text-lg leading-relaxed">
          Despierta tu creatividad con la{" "}
            inteligencia artificial.  
          Escribe tu <span className="text-[#FA6063] font-semibold">especialidad</span> (por ejemplo: dibujante, diseñadora, fotógrafa o animador) y genera un{" "}
          reto personalizado.
          <br />
        </p>
      </div>

      {/* Formulario de reto */}
      <div className="bg-[#141414] rounded-2xl p-8 w-full max-w-xl border border-[#8936D2]/50 backdrop-blur-lg transition-all duration-300 hover:shadow-[#A39FF6]/40">
        <h2 className="text-2xl font-semibold text-[#A39FF6] mb-6 text-center">
          Genera tu reto creativo
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Escribe tu especialidad (ej: dibujante)"
            value={specialty}
            onChange={handleSpecialtyChange}
            className="flex-1 px-4 py-3 rounded-lg bg-[#1f1f1f] text-white border border-[#96E2FF]/40 focus:outline-none focus:ring-2 focus:ring-[#96E2FF] placeholder-gray-500"
          />

          <button
            onClick={handleGetChallenge}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              loading || buttonDisabled
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-[#F778BD] to-[#FA6063] hover:opacity-90"
            }`}
            disabled={loading || buttonDisabled}
          >
            {loading
              ? "Cargando..."
              : buttonDisabled
              ? "Reto generado ✅"
              : "Obtener Reto"}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-center font-medium mb-4">{error}</p>
        )}

        {challenge && (
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#96E2FF]/30 text-gray-200 mt-4">
            <h3 className="text-xl font-bold mb-2 text-[#96E2FF]">Tu reto:</h3>
            <p className="mb-4">{challenge.reto}</p>

            <h4 className="font-semibold mb-2 text-gray-300">Pasos:</h4>
            <ol className="list-decimal list-inside space-y-1 mb-4">
              {challenge.pasos.map((paso, index) => (
                <li key={index}>{paso}</li>
              ))}
            </ol>

            <p className="text-[#FDD519] font-medium text-center mt-4">
              {challenge.nota}
            </p>
          </div>
        )}
      </div>

      {/* Espacio para futuras publicaciones */}
      <div className="mt-20 w-full max-w-5xl text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FA6063] to-[#FDD519] text-transparent bg-clip-text mb-4">
          Próximamente
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Aquí se mostrarán las publicaciones más creativas con el hashtag{" "}
          <span className="text-[#F778BD] font-semibold">#RetoHarixom</span>.  
          ¡Prepárate para inspirarte con los proyectos de la comunidad!
        </p>
        <div className="mt-8 h-48 border-2 border-dashed border-[#A39FF6]/40 rounded-2xl flex items-center justify-center text-gray-500">
          <span>Contenido en desarrollo...</span>
        </div>
      </div>
    </div>
  );
}
