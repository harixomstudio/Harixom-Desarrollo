import { createFileRoute } from "@tanstack/react-router";
import CardPage from "../components/pages/CardEventsPage";

export const Route = createFileRoute("/Workshops")({
  component: RouteComponent,
});

function RouteComponent() {
  const workshops = [
    {
      image: "https://cdn.example.com/workshop1.jpg",
      name: "Workshop 1",
      description: "Taller intensivo de React.",
      price: "50.00",
      link: "/workshop/1",
    },
    {
      image: "https://cdn.example.com/workshop2.jpg",
      name: "Workshop 2",
      description: "Taller de JavaScript avanzado.",
      price: "60.00",
      link: "/workshop/2",
    },
    {
      image: "https://cdn.example.com/workshop3.jpg",
      name: "Workshop 3",
      description: "Taller de diseño UX/UI.",
      price: "70.00",
      link: "/workshop/3",
    },
    {
      image: "https://cdn.example.com/workshop4.jpg",
      name: "Workshop 4",
      description: "Taller de marketing digital.",
      price: "80.00",
      link: "/workshop/4",
    },
    {
      image: "https://cdn.example.com/workshop5.jpg",
      name: "Workshop 5",
      description: "Taller de fotografía.",
      price: "90.00",
      link: "/workshop/5",
    },
    {
      image: "https://cdn.example.com/workshop6.jpg",
      name: "Workshop 6",
      description: "Taller de desarrollo personal.",
      price: "100.00",
      link: "/workshop/6",
    },
  ];
  return <CardPage events={workshops} />;
}
