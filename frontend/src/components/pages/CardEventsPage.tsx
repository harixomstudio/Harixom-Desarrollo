import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface Event {
  id: number;
  image?: string;
  type: string;
  title: string;
  description?: string;
  dateStart: string;
  timeStart: string;
  dateEnd: string;
  timeEnd: string;
}

interface CardEventsProps {
  events: Event[];
}

export default function CardEvents({ events }: CardEventsProps) {


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
        {events.slice(0, visibleCount).map((event) => (
          <div
            key={event.id}
            className="bg-gray-100 rounded-xl overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition w-full"
          >
            {/* Imagen de prueba */}
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-5 flex flex-col flex-1">
              <h2 className="text-xl font-bold mb-2 text-gray-900">
                {event.title}
              </h2>
              <p className="text-sm text-gray-700 mb-3 flex-1">
                {event.description || "Sin descripción"}
              </p>

              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p>
                  <strong>Fecha inicio:</strong> {event.dateStart}{" "}
                  <strong>Hora:</strong> {event.timeStart}
                </p>
                <p>
                  <strong>Fecha fin:</strong> {event.dateEnd}{" "}
                  <strong>Hora:</strong> {event.timeEnd}
                </p>
              </div>

              <Link
                to="/EventsDetail"
                search={{ eventId: event.id.toString() }}
                className="mt-auto block text-center rounded-full bg-purple-600 text-white font-semibold py-2 text-base transition hover:bg-purple-500"
              >
                Más info
              </Link>
            </div>
          </div>
        ))}
      </div>
      {visibleCount < events.length || events.length === 0 ? ( // esto es el loading se activa al scrollear
        <div className="flex justify-center pt-10 pb-15">
          <div className="flex space-x-3">
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.6s]"></div>
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      ) : <div className="text-gray-400 text-sm text-center pb-5 pt-10"> NO HAY MAS EVENTOS</div> }
    </div>
  );
}
