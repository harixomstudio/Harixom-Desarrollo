import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "../components/pages/DashboardPage";
import Dashboard3 from "../components/pages/Dashboard3Page";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/Dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const token = localStorage.getItem("access_token");

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data } = await axios.get(
        "http://127.0.0.1:8000/api/user",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    },
    enabled: !!token,
  });

  const { data: publicaciones } = useQuery({
    queryKey: ["allPublications"],
    queryFn: async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/api/publications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Error al obtener las publicaciones");
      const json = await response.json();
      return json.publications;
    },
    enabled: !!token,
  });

  const { data: followsData } = useQuery({
    queryKey: ["userFollows"],
    queryFn: async () => {
      const { data } = await axios.get(
        "http://127.0.0.1:8000/api/user/follows",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
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
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <p className="text-red-500 text-center mt-10">
        {(error as Error).message}
      </p>
    );

  const followers = followsData?.followers?.length || 0;
  const followings = followsData?.followings?.length || 0;

  // Datos generales
  const publications = profileData?.user?.posts?.length || 0;
  const userId = profileData?.user?.id;
  const likesGeneral = publicaciones
    ?.filter((pub: { user_id: any }) => pub.user_id === userId)
    ?.reduce((acc: any, pub: { total_likes: any }) => acc + (pub.total_likes || 0), 0) || 0;

  // Datos de los últimos 3 meses
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const recentPublications = publicaciones?.filter(
    (pub: { user_id: any; created_at: string }) => {
      const publicationDate = new Date(pub.created_at);
      return pub.user_id === userId && publicationDate >= threeMonthsAgo;
    }
  ) || [];

  const likesLastThreeMonths = recentPublications.reduce(
    (acc: any, pub: { total_likes: any }) => acc + (pub.total_likes || 0),
    0
  );

  // Seguidores y seguidos en los últimos 3 meses (si aplica)
  const recentFollowers = followsData?.followers?.filter(
    (follower: { created_at: string }) => {
      const followDate = new Date(follower.created_at);
      return followDate >= threeMonthsAgo;
    }
  ).length || 0;

  const recentFollowings = followsData?.followings?.filter(
    (following: { created_at: string }) => {
      const followDate = new Date(following.created_at);
      return followDate >= threeMonthsAgo;
    }
  ).length || 0;

  return (
    <div
      className="p-6 min-h-screen overflow-visible" // Permite que el contenedor crezca dinámicamente
      style={{ overflowX: "hidden" }} // Evita el desplazamiento horizontal
    >
      {/* Dashboard general */}
      <div className="mb-10">
        <h2 className="text-white text-2xl lg:text-3xl font-bold mb-8 text-center">
          Dashboard General
        </h2>
        <Dashboard
          followers={followers}
          following={followings}
          publications={publications}
          likes={likesGeneral}
        />
      </div>

      {/* Dashboard de los últimos 3 meses */}
      <div>
        <h2 className="text-white text-2xl lg:text-3xl font-bold mb-8 text-center">
          Dashboard Últimos 3 Meses
        </h2>
        <Dashboard3
          followers={recentFollowers} // Seguidores en los últimos 3 meses
          following={recentFollowings} // Seguidos en los últimos 3 meses
          publications={recentPublications.length} // Publicaciones en los últimos 3 meses
          likes={likesLastThreeMonths} // Likes en los últimos 3 meses
        />
      </div>
    </div>
  );
}