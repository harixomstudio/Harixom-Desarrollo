import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";

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

  // 🔥 Nuevo estado para las publicaciones con el hashtag
  const [retoPosts, setRetoPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [currentUserId] = useState<number | null>(null);

  const handleGetChallenge = async () => {
    if (!specialty.trim()) return alert("Escribe tu especialidad primero.");

    setLoading(true);
    setError("");
    setChallenge(null);
    setButtonDisabled(true);

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "https://harixom-desarrollo.onrender.com/api/ia/challenge",
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

  const navigate = useNavigate();

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecialty(e.target.value);
    setButtonDisabled(false);
  };

  // 🔥 Cargar publicaciones con el hashtag #RetoHarixom
  useEffect(() => {
    const fetchRetoPosts = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(
          "https://harixom-desarrollo.onrender.com/api/publications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Filtra las publicaciones que contengan el hashtag
        const filtered = res.data.publications.filter((p: any) =>
          p.description?.toLowerCase().includes("#retoharixom")
        );
        setRetoPosts(filtered);
      } catch (err) {
        console.error("Error cargando publicaciones del reto:", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchRetoPosts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-[#0d0d0d] via-[#1a1a1a] to-[#262626] text-white px-4 sm:px-6 py-8 sm:py-12" style={{ fontFamily: "Montserrat" }}>
      {/* Encabezado */}
      <div className="max-w-2xl text-center mb-8 sm:mb-12">
        <h1
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-[#F778BD] via-[#A39FF6] to-[#96E2FF] text-transparent bg-clip-text"
          style={{ fontFamily: "Starstruck" }}
        >
          Reto Harixom IA
        </h1>
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          Despierta tu creatividad con la{" "}
          inteligencia artificial.
          Escribe tu <span className="text-[#FA6063] font-semibold">especialidad</span> (ej: dibujante, diseñadora, fotógrafa o animador) y genera un{" "}
          reto personalizado.
          <br />
        </p>
      </div>

      {/* Formulario de reto */}
      <div className="bg-[#141414] rounded-2xl p-6 sm:p-8 w-full max-w-xl border border-[#8936D2]/50 backdrop-blur-lg transition-all duration-300 hover:shadow-[#A39FF6]/40">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#A39FF6] mb-4 sm:mb-6 text-center">
          Genera tu reto creativo
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <input
            type="text"
            placeholder="Escribe tu especialidad (ej: dibujante)"
            value={specialty}
            onChange={handleSpecialtyChange}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-[#1f1f1f] text-white border border-[#96E2FF]/40 focus:outline-none focus:ring-2 focus:ring-[#96E2FF] placeholder-gray-500 text-sm sm:text-base"
          />

          <button
            onClick={handleGetChallenge}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${loading || buttonDisabled
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
          <p className="text-red-500 text-center font-medium mb-2 sm:mb-4 text-sm sm:text-base">{error}</p>
        )}

        {challenge && (
          <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-lg border border-[#96E2FF]/30 text-gray-200 mt-4 text-sm sm:text-base">
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#96E2FF]">Tu reto:</h3>
            <p className="mb-3 sm:mb-4">{challenge.reto}</p>

            <h4 className="font-semibold mb-1 sm:mb-2 text-gray-300">Pasos:</h4>
            <ol className="list-decimal list-inside space-y-1 mb-3 sm:mb-4">
              {challenge.pasos.map((paso, index) => (
                <li key={index}>{paso}</li>
              ))}
            </ol>

            <p className="text-[#FDD519] font-medium text-center mt-2 sm:mt-4">{challenge.nota}</p>
          </div>
        )}
      </div>

      {/* Publicaciones con el hashtag */}
      <div className="mt-20 w-full max-w-6xl text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FA6063] to-[#FDD519] text-transparent bg-clip-text mb-4">
          Publicaciones del #RetoHarixom
        </h2>

        {loadingPosts ? (
          <div className="flex justify-center py-10">
            <div className="flex space-x-3">
              <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.6s]"></div>
              <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        ) : retoPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {retoPosts.map((pub) => (
              <div
                key={pub.id}
                className="bg-[#141414] rounded-2xl overflow-hidden w-[400px] shadow-md hover:shadow-[#A39FF6]/40 transition-transform duration-300 hover:-translate-y-2"
              >
                {/* Encabezado del usuario */}
                <div className="relative w-full h-[300px] aspect-square flex items-center justify-center cursor-pointer">
                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-[#07070741] rounded-xl pr-2">
                  <img
                    src={
                      pub.user_profile_picture ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    alt={pub.user_name}
                    className="w-9 h-9 rounded-full border-2 border-white object-cover cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (pub.user_id === currentUserId) {
                        navigate({
                          to: "/ProfileGuest",
                          search: { userId: pub.user_id },
                        });
                      } else {
                        navigate({ to: "/Profile" });
                      }
                    }}
                  />

                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (pub.user_id === currentUserId) {
                        navigate({
                          to: "/ProfileGuest",
                          search: { userId: pub.user_id },
                        });
                      } else {
                        navigate({ to: "/Profile" });
                      }
                    }}
                  >
                    <span className="text-white font-semibold  hover:text-pink-400 transition-colors drop-shadow-md">
                    {pub.user_name || "ArtistUser"}
                  </span>

                  {pub.is_premium && (
                    <img
                      src="/premium.svg"
                      alt="Insignia Premium"
                      className="w-6 h-6 drop-shadow-md"
                      title="Usuario Premium"
                    />
                  )}
                  </div>
                </div>

                {/* Imagen principal */}
                <img
                  src={pub.image}
                  alt={pub.description}
                  className="w-full h-64 object-cover"
                />
                </div>

                {/* Descripción */}
                <div className="p-4 text-left">
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {pub.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Aún no hay publicaciones con el hashtag{" "}
            <span className="text-[#F778BD] font-semibold">#RetoHarixom</span>.
            ¡Sé la primera persona en participar!
          </p>
        )}
      </div>
    </div>
  );
}
