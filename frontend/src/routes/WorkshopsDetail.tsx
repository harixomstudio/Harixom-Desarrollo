import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import TallerDetailPage from "../components/pages/TallerDetailPage";

export const Route = createFileRoute("/WorkshopsDetail")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tallerId: search.tallerId as string,
    };
  },
  component: TallerDetailRouteComponent,
});

function TallerDetailRouteComponent() {
  const token = localStorage.getItem("access_token");
  const { tallerId } = Route.useSearch();

  const { data: tallerData, isLoading, error } = useQuery({
    queryKey: ["tallerDetail", tallerId],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://127.0.0.1:8000/api/tallers/${tallerId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      return data;
    },
    enabled: !!tallerId,
  });

  if (!tallerId)
    return <p className="text-white text-center mt-10">Taller no especificado.</p>;
  if (isLoading)
    return <p className="text-white text-center mt-10">Cargando...</p>;
  if (error)
    return (
      <p className="text-red-500 text-center mt-10">
        {(error as Error).message}
      </p>
    );

  return <TallerDetailPage taller={tallerData} />;
}