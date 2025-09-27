import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import CardTallers from "../components/pages/CardTallersPage"; 

export const Route = createFileRoute("/Workshops")({
  component: RouteComponent,
});

function RouteComponent() {
  const [workshops, setWorkshops] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/tallers")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((taller: any) => ({
          id: taller.id,
          title: taller.title,
          description: taller.description,
          place: taller.place,
          dateStart: taller.dateStart,
          timeStart: taller.timeStart,
          duration: taller.duration,
          contributor: taller.contributor,
        }));
        setWorkshops(formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  return <CardTallers tallers={workshops} />;
}
