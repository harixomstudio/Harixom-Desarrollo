import { Link } from "@tanstack/react-router";

interface Event {
  image: string;
  name: string;
  description: string;
  price: string;
  link: string;
}

interface CardPageProps {
  events: Event[];
}

export default function CardPage({ events }: CardPageProps) {
  return (
    <div className="bg-black flex p-6 w-full">
      <div className="grid grid-cols-3 gap-8 w-full">
        {events.map((event, idx) => (
          <div
            key={idx}
            className="bg-gray-200 rounded-xl overflow-hidden flex flex-col shadow-md w-full max-w-md"
          >
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5 flex flex-col flex-1">
              <h2 className="text-xl font-bold mb-2">{event.name}</h2>
              <p className="text-sm text-gray-800 mb-4 flex-1">
                {event.description}
              </p>
              <p className="font-bold text-lg mb-4">${event.price}</p>
              <Link
                to={event.link}
                className="block text-center rounded-full bg-purple-600 text-white font-semibold py-2 text-lg transition hover:bg-purple-500"
              >
                More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
