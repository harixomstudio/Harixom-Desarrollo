import { createFileRoute } from '@tanstack/react-router'
import Dashboard from "../components/pages/DashboardPage";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute('/Dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const token = localStorage.getItem("access_token");

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data } = await axios.get("https://harixom-desarrollo.onrender.com/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    enabled: !!token,
  });

  const { data: publicaciones } = useQuery({
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
      return json.publications;
    },
    enabled: !!token,
  });

  const { data: followsData } = useQuery({
    queryKey: ["userFollows"],
    queryFn: async () => {
      const { data } = await axios.get("https://harixom-desarrollo.onrender.com/api/user/follows", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // ✅ Publicaciones hechas por el usuario
  const publications = profileData?.user?.posts?.length || 0;

  // ✅ Likes recibidos en tus publicaciones
  const userId = profileData?.user?.id;
  const likes = publicaciones
    ?.filter((pub: { user_id: any; }) => pub.user_id === userId)
    ?.reduce((acc: any, pub: { total_likes: any; }) => acc + (pub.total_likes || 0), 0) || 0;

  return (
    <div className="p-6 h-screen overflow-hidden">
      <Dashboard
        followers={followers}
        following={followings}
        publications={publications}
        likes={likes}
      />
    </div>
  );
}