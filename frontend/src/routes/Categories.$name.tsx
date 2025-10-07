import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Categories from "../components/pages/Categories";

export const Route = createFileRoute("/Categories/$name")({
  component: RouteComponent,
});

function RouteComponent() {
  const token = localStorage.getItem("access_token");
  const { name } = useParams({ from: "/Categories/$name" });

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
    return (
      <div className="flex bg-stone-950 text-white items-center h-full justify-center pb-20">
        <div className="flex space-x-3">
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.6s]"></div>
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce "></div>
        </div>
      </div>
    );
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

  const categoryPublications = sortedPublications.filter(
    (pub: { category?: string }) =>
      pub.category?.toLowerCase() === name.toLowerCase()
  );
  const categoryConfig: Record<string, { style: string; icon: string; alt: string }> = {
    "Photography": { style: "text-[#ff6161]", icon: "../public/icon-foto.svg", alt: "Photography icon", },
    "3D Art": { style: "text-[#DBFF4F]", icon: "../icon-3d.svg", alt: "3D category icon", },
    "Animation": { style: "text-[#A39FF6]", icon: "../public/icon-animacion.svg", alt: "Animation icon", },
    "Sculpture": { style: "text-[#9fe2f6]", icon: "../public/icon-sculture.svg", alt: "Sculpture icon", },
    "Traditional": { style: "text-[#61ffa3]", icon: "../public/icon-traditional.svg", alt: "Traditional art icon", },
    "Street Art": { style: "text-[#fddb1a]", icon: "../public/icon-streetart.svg", alt: "Street art icon",},
    "Digital Art": { style: "text-pink-400", icon: "../public/icon-digitalart.svg", alt: "Digital art icon", }, };

     const category = categoryConfig[name as keyof typeof categoryConfig];

  return <Categories
    title={name}
    style={category.style}
    icon={category.icon}
    altIcon={category.alt}
    categoriesPublications={categoryPublications}
  />;
}
