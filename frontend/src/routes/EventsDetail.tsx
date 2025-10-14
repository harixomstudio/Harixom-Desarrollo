import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import EventDetailPage from "../components/pages/EventsDetailPage";

export const Route = createFileRoute("/EventsDetail")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      eventId: search.eventId as string,
    };
  },
  component: EventDetailRouteComponent,
});

function EventDetailRouteComponent() {
  const token = localStorage.getItem("access_token");
  const { eventId } = Route.useSearch();

  const { data: eventData, isLoading, error } = useQuery({
    queryKey: ["eventDetail", eventId],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://harixom-desarrollo.onrender.com/api/events/${eventId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      return data;
    },
    enabled: !!eventId,
  });

  if (!eventId) return <p className="text-white text-center mt-10">Evento no especificado.</p>;
  if (isLoading) return (
    <div className="flex bg-stone-950 text-white items-center h-full justify-center pb-20">
      <div className="flex space-x-3">
        <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.6s]"></div>
        <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce "></div>
      </div>
    </div>
  );
  if (error) return <p className="text-red-500 text-center mt-10">{(error as Error).message}</p>;

  return <EventDetailPage event={eventData} />;
}
