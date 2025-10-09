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

interface EventDetailPageProps {
  event: Event;
}

export default function EventDetailPage({ event }: EventDetailPageProps) {
  return (
    <div className="bg-black min-h-screen p-6 text-white flex flex-col items-center"
    style={{ fontFamily: "Monserrat" }}>
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <img
        src={event.image || "https://cdn.pixabay.com/photo/2023/03/16/08/42/camping-7856198_960_720.jpg"}
        alt={event.title}
        className="w-full max-w-2xl h-auto mb-6 rounded-lg"
      />
      <p className="text-gray-300 mb-4">{event.description || "Sin descripción"}</p>
      <div className="text-gray-400 space-y-2 text-lg">
        <p><strong>Tipo:</strong> {event.type}</p>
        <p><strong>Fecha inicio:</strong> {event.dateStart} <strong>Hora:</strong> {event.timeStart}</p>
        <p><strong>Fecha fin:</strong> {event.dateEnd} <strong>Hora:</strong> {event.timeEnd}</p>
      </div>
    </div>
  );
}
