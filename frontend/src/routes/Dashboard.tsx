import { createFileRoute } from '@tanstack/react-router'
import Dashboard from "../components/pages/DashboardPage";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const Route = createFileRoute('/Dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const token = localStorage.getItem("access_token");

  // Query perfil
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

  // Query likes
  const { data: likesData } = useQuery({
    queryKey: ["userLikes"],
    queryFn: async () => {
      const { data } = await axios.get("https://harixom-desarrollo.onrender.com/api/user/likes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.likes;
    },
    enabled: !!token,
  });

  // Query followers/followings
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

   // Extraer datos necesarios
  const followers = followsData?.followers?.length || 0;
  const followings = followsData?.followings?.length || 0;
  const publications = profileData?.publications?.length || 0;
  const likes = likesData?.length || 0;


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
