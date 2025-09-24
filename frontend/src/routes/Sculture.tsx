<<<<<<< Updated upstream
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import CategoriesPage from '../components/pages/CategoriesPage';

export const Route = createFileRoute('/Sculture')({
  component: RouteComponent,
})

const initialPublications = [
  {
    id: 1,
    image: 'https://cdn.pixabay.com/photo/2022/11/05/19/03/generated-7572592_1280.jpg',
    user_name: 'Artist 1',
    category: 'Sculture',
    description: 'Description for publication 1',
    liked: false,
    likesCount: 0,
  },
  {
    id: 2,
    image: 'https://cdn.pixabay.com/photo/2022/10/05/05/26/sculpture-7499732_1280.jpg',
    user_name: 'Artist 2',
    category: 'Sculture',
    description: 'Description for publication 2',
    liked: false,
    likesCount: 0,
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/150',
    user_name: 'Artist 3',
    category: 'Sculture',
    description: 'Description for publication 3',
    liked: false,
    likesCount: 0,
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/150',
    user_name: 'Artist 4',
    category: 'Sculture',
    description: 'Description for publication 4',
    liked: false,
    likesCount: 0,
  },
  
];

function RouteComponent() {
  const [publications, setPublications] = useState(initialPublications);


  const handleLike = (id: number) => {
    setPublications((prev) =>
      prev.map((pub) =>
        pub.id === id ? { ...pub, liked: !pub.liked } : pub
      )
    );
  };

  const handleComment = (id: number) => {
    // 
  };

  return (
    <section className="min-h-screen bg-stone-950 p-10">
      <div className="flex items-center gap-3 mb-8">
        <img
          src="./public/icon-sculture.svg" 
          alt="sculture Icon"
          className="w-15 h-15 mt-2"
        />
        <span className="text-[#96E2FF] text-4xl font-bold">Sculture</span>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {publications.map((pub) => (
          <CategoriesPage
            key={pub.id}
            publication={pub}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
      </div>
    </section>
  );

=======
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import FeedPage from "../components/pages/FeedPage";

export const Route = createFileRoute("/Sculture")({
  component: RouteComponent,
});

function RouteComponent() {
  const token = localStorage.getItem("access_token");

  const { data, isLoading, error } = useQuery({
    queryKey: ["allPublications"],
    queryFn: async () => {
      const response = await fetch("http://127.0.0.1:8000/api/publications", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al obtener las publicaciones");
      const json = await response.json();
      return json.publications; // Ajusta según tu Resource
    },
    enabled: !!token,
  });

  if (!token)
    return <p className="text-white text-center mt-10">No estás logueado.</p>;
  if (isLoading)
    return <p className="text-white text-center mt-10">Loading...</p>;
  if (error)
    return (
      <p className="text-red-500 text-center mt-10">
        {(error as Error).message}
      </p>
    );

  // Ordena de más reciente a más antiguo
  const sortedPublications = (data || []).sort(
    (a: { created_at: string }, b: { created_at: string }) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const sculturePublications = sortedPublications.filter(
    (pub: { category?: string }) =>
      pub.category?.toLowerCase() === "Sculture".toLowerCase()
  );

  return <FeedPage publications={sculturePublications} />;
>>>>>>> Stashed changes
}
