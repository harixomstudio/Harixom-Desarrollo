import { createFileRoute } from '@tanstack/react-router'
import CardPage from "../components/pages/CardEventsPage";

export const Route = createFileRoute('/Events')({
  component: RouteComponent,
})

function RouteComponent() {
  const events = [
    {
      image: "https://cdn.pixabay.com/photo/2023/03/16/08/42/camping-7856198_960_720.jpg",
      name: "Sample Event",
      description: "This is a description of the sample event.",
      price: "20.00",
      link: "/event1"
    },
    {
      image: "https://cdn.pixabay.com/photo/2017/01/20/00/30/mountains-1995695_960_720.jpg",
      name: "Mountain Adventure",
      description: "Explore the mountains with this thrilling event.",
      price: "30.00",
      link: "/event2"
    },
    {
      image: "https://cdn.pixabay.com/photo/2016/11/29/09/08/adventure-1868811_960_720.jpg",
      name: "Forest Hike",
      description: "A peaceful walk through the forest.",
      price: "15.00",
      link: "/event3"
    },
    {
      image: "https://cdn.pixabay.com/photo/2017/08/07/18/13/sunset-2605537_960_720.jpg",
      name: "Sunset Yoga",
      description: "Relax and unwind with a yoga session at sunset.",
      price: "10.00",
      link: "/event4"
    }, 
    {
      image: "https://cdn.pixabay.com/photo/2015/03/26/09/54/adventure-690176_960_720.jpg",
      name: "River Rafting",
      description: "Experience the thrill of river rafting.",
      price: "40.00",
      link: "/event5"
    },
    {
      image: "https://cdn.pixabay.com/photo/2016/11/29/03/53/adventure-1867189_960_720.jpg",
      name: "Desert Safari",
      description: "Explore the desert landscape with this exciting safari.",
      price: "50.00",
      link: "/event6"
    }
  ];
  return <CardPage events={events} />;
}
