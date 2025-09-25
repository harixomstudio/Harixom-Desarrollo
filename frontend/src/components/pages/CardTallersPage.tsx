import { Link } from "@tanstack/react-router";

interface Taller {
  id: number;
  mode: string;
  dateStart: string;
  timeStart: string;
  duration?: string;
  place: string;
  title: string;
  description: string;
  contributor?: string;
}

interface CardTallersProps {
  tallers: Taller[];
}

export default function CardTallers({ tallers }: CardTallersProps) {
  return (
    <div className="bg-black p-6 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {tallers.map((taller) => (
          <div
            key={taller.id}
            className="bg-gray-100 rounded-xl overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition w-full"
          >
            {/* Imagen de prueba */}
            <img
              src="https://cdn.pixabay.com/photo/2023/03/16/08/42/camping-7856198_960_720.jpg"
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
                to={`/tallers/${taller.id}` as any}
                className="mt-auto block text-center rounded-full bg-blue-600 text-white font-semibold py-2 text-base transition hover:bg-blue-500"
              >
                Ver más
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
