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
        `https://harixom-desarrollo.onrender.com/api/tallers/${tallerId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      return data.taller;
    },
    enabled: !!tallerId,
  });

  if (!tallerId)
    return <p className="text-white text-center mt-10">Taller no especificado.</p>;
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

  return <TallerDetailPage taller={tallerData} />;
}