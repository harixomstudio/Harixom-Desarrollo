import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface Taller {
  id: number;
  mode: string;
  dateStart: string;
  timeStart: string;
  duration?: string;
  place: string;
  image?: string;
  title: string;
  description: string;
  contributor?: string;
}

interface CardTallersProps {
  tallers: Taller[];
}

export default function CardTallers({ tallers }: CardTallersProps) {

  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => { //Despliegue de un feed infinito, scroll aparece cargando y aumentan las publicaciones
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
        setVisibleCount((prevCount) => prevCount + 9);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };


  }, [visibleCount]);


  return (
    <div className="bg-black p-6 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {tallers.slice(0, visibleCount).map((taller) => (
          <div
            key={taller.id}
            className="bg-gray-100 rounded-xl overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition w-full"
          >
            {/* Imagen de prueba */}
            <img
              src={taller.image}
              alt={taller.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-5 flex flex-col flex-1">
              <h2 className="text-xl font-bold mb-2 text-gray-900">
                {taller.title}
              </h2>
              <p className="text-sm text-gray-700 mb-3">{taller.description}</p>

              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p>
                  <strong>Lugar:</strong> {taller.place}
                </p>
                <p>
                  <strong>Fecha:</strong> {taller.dateStart}{" "}
                  <strong>Hora:</strong> {taller.timeStart}
                </p>
                {taller.duration && (
                  <p>
                    <strong>Duración:</strong> {taller.duration}
                  </p>
                )}
                {taller.contributor && (
                  <p>
                    <strong>Impartido por:</strong> {taller.contributor}
                  </p>
                )}
              </div>

              <Link
                to="/WorkshopsDetail"
                search={{ tallerId: taller.id.toString() }}
                className="mt-auto block text-center rounded-full bg-blue-600 text-white font-semibold py-2 text-base transition hover:bg-blue-500"
              >
                Ver más
              </Link>
            </div>
          </div>
        ))}
      </div>
      {visibleCount < tallers.length || tallers.length === 0 ? ( // esto es el loading se activa al scrollear
        <div className="flex justify-center pt-10 pb-15">
          <div className="flex space-x-3">
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.6s]"></div>
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      ) :<div className="text-gray-400 text-sm text-center pb-5 pt-10"> NO HAY MAS TALLERES</div> }
      <Link to="/TallerCreate" className="fixed bottom-8 right-8 bg-pink-500 text-white rounded-full p-4 shadow-lg">＋</Link>
    </div>
  );
}
