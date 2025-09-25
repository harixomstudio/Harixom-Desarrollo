import { Link } from "@tanstack/react-router";

interface Event {
  id: number;
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
  return (
    <div className="bg-black p-6 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-gray-100 rounded-xl overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition w-full"
          >
            {/* Imagen de prueba */}
            <img
              src="https://cdn.pixabay.com/photo/2023/03/16/08/42/camping-7856198_960_720.jpg"
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
                to={`/events/${event.id}` as any}
                className="mt-auto block text-center rounded-full bg-purple-600 text-white font-semibold py-2 text-base transition hover:bg-purple-500"
              >
                Más info
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
