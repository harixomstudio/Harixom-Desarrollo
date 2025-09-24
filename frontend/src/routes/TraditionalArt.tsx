import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import FeedPage from "../components/pages/FeedPage";

export const Route = createFileRoute("/TraditionalArt")({
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

  const traditionalArtPublications = sortedPublications.filter(
    (pub: { category?: string }) =>
      pub.category?.toLowerCase() === "Traditional Art".toLowerCase()
  );

  return <FeedPage publications={traditionalArtPublications} />;
}
