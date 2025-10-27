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
    <main className="bg-black min-h-screen p-6 text-white flex flex-col items-center"
      style={{ fontFamily: "Montserrat" }}>
      <a href="/Events" className="text-white mb-8 mr-auto bg-gradient-to-r from-pink-400 to-sky-400 hover:scale-110 transform duration-300 px-15 py-2 rounded-4xl max-lg:hidden">Back</a>
      <div className="flex flex-col items-center border-2 border-gray-600 rounded-2xl p-6 bg-stone-900">
        <h1 className="text-4xl max-lg:text-2xl font-bold mb-4 font-startruc ">{event.title}</h1>
        <img
          src={event.image}
          alt={event.title}
          className="w-full max-w-2xl h-auto mb-6 rounded-lg"
        />
        <div className="text-gray-200 space-y-2 text-lg text-start flex flex-col w-full">
          <p><strong>Tipo:</strong> {event.type}</p>
          <p><strong>Fecha inicio:</strong> {event.dateStart} <strong className="pl-4">Hora:</strong> {event.timeStart}</p>
          <p><strong>Fecha fin:</strong> {event.dateEnd} <strong className="pl-10">Hora:</strong> {event.timeEnd}</p>
        </div>
        <p className="text-gray-100 my-4 w-full lg:text-xl">{event.description || "Sin descripción"}</p>
      </div>
      <a href="/Events" className="text-white mt-8 mr-auto bg-gradient-to-r from-pink-400 to-sky-400 hover:scale-110 transform duration-300 px-15 py-2 rounded-4xl lg:hidden">Back</a>

    </main>
  );
}
