import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import CardEvents from "../components/pages/CardEventsPage"; 

export const Route = createFileRoute("/Events")({
  component: RouteComponent,
});

function RouteComponent() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://harixom-desarrollo.onrender.com/api/events")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((event: any) => ({
          id: event.id,
          image: event.image,
          title: event.title,
          description: event.description,
          dateStart: event.dateStart,
          timeStart: event.timeStart,
          dateEnd: event.dateEnd,
          timeEnd: event.timeEnd,
        }));
        setEvents(formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  return <CardEvents events={events} />;
}
