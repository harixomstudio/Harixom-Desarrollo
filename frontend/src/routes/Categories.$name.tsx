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
      const response = await fetch("https://harixom-desarrollo.onrender.com/api/publications", {
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
 const categoryConfig: Record<string, {
  style: string;
  icon: string;
  alt: string;
  info: React.ReactNode;
}> = {
  "Photos": {
    style: "text-[#ff6161]",
    icon: "../icon-foto.svg",
    alt: "Photography icon",
    info: (
      <>
        <p className="mb-2 text-xl">
          Capturing still images using light. Focuses on the moment and visual composition.
        </p>
        <ul className="list-disc list-inside text-lg space-y-1">
          <li>Portraits</li>
          <li>Landscapes</li>
          <li>Documentary</li>
          <li>Street photography</li>
          <li>Experimental shots</li>
        </ul>
      </>
    ),
  },
  "3D Art": {
    style: "text-[#DBFF4F]",
    icon: "../icon-3d.svg",
    alt: "3D category icon",
    info: (
      <>
        <p className="mb-2 text-xl">
          Creating shapes and worlds with volume in digital or physical spaces.
        </p>
        <ul className="list-disc list-inside text-lg space-y-1">
          <li>Modeling</li>
          <li>3D printed sculptures</li>
          <li>Renderings</li>
          <li>Virtual environments</li>
          <li>Character sculpting</li>
        </ul>
      </>
    ),
  },
  "Animation": {
    style: "text-[#A39FF6]",
    icon: "../icon-animacion.svg",
    alt: "Animation icon",
    info: (
      <>
        <p className="mb-2 text-xl">
          Illusion of motion created from a sequence of static images.
        </p>
        <ul className="list-disc list-inside text-lg space-y-1">
          <li>Animated films</li>
          <li>GIFs</li>
          <li>Stop-motion</li>
          <li>Motion graphics</li>
          <li>2D/3D animation</li>
        </ul>
      </>
    ),
  },
  "Sculpture": {
    style: "text-[#9fe2f6]",
    icon: "../icon-sculture.svg",
    alt: "Sculpture icon",
    info: (
      <>
        <p className="mb-2 text-xl">
          The art of creating tangible three-dimensional forms through carving, modeling, or assembling.
        </p>
        <ul className="list-disc list-inside text-lg space-y-1">
          <li>Round objects</li>
          <li>Reliefs</li>
          <li>Installations</li>
          <li>Clay figures</li>
          <li>Mixed media sculptures</li>
        </ul>
      </>
    ),
  },
  "Traditional": {
    style: "text-[#61ffa3]",
    icon: "../icon-traditional.svg",
    alt: "Traditional art icon",
    info: (
      <>
        <p className="mb-2 text-xl">
          Disciplines that use classic physical materials and methods (not digital ones).
        </p>
        <ul className="list-disc list-inside text-lg space-y-1">
          <li>Oil painting</li>
          <li>Watercolor</li>
          <li>Pencil drawing</li>
          <li>Ink</li>
          <li>Engraving</li>
        </ul>
      </>
    ),
  },
  "Street Art": {
    style: "text-[#fddb1a]",
    icon: "../icon-streetart.svg",
    alt: "Street art icon",
    info: (
      <>
        <p className="mb-2 text-xl">
          Art in public spaces, often with a social message and ephemeral in nature.
        </p>
        <ul className="list-disc list-inside text-lg space-y-1">
          <li>Graffiti</li>
          <li>Murals</li>
          <li>Stencils</li>
          <li>Urban interventions</li>
          <li>Paste-ups</li>
        </ul>
      </>
    ),
  },
  "Digital Art": {
    style: "text-pink-400",
    icon: "../icon-digitalart.svg",
    alt: "Digital art icon",
    info: (
      <>
        <p className="mb-2 text-xl">
          Works created and manipulated entirely with digital tools and software.
        </p>
        <ul className="list-disc list-inside text-lg space-y-1">
          <li>Digital illustration</li>
          <li>Concept art</li>
          <li>Photomontage</li>
          <li>Abstract compositions</li>
          <li>Character design</li>
        </ul>
      </>
    ),
  },
};
     const category = categoryConfig[name as keyof typeof categoryConfig];
return (
  <Categories
    title={name}
    style={category.style}
    icon={category.icon}
    altIcon={category.alt}
    categoriesPublications={categoryPublications}
    info={category.info}
  />
);
}
