import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Profile from "../components/pages/ProfilePage";
import axios from "axios";
import { useEffect } from "react";

export const Route = createFileRoute("/Profile")({
  component: ProfileRoute,
});

function ProfileRoute() {
  const token = localStorage.getItem("access_token");

  // Query perfil
  const { data: profileData, isLoading, error, refetch } = useQuery({
  queryKey: ["userProfile"],
  queryFn: async () => {
    const { data } = await axios.get("https://harixom-desarrollo.onrender.com/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
  enabled: !!token,
});

useEffect(() => {
  refetch();
}, []);

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

  const user = profileData.user;

  // Ordenar posts del más reciente al más antiguo
  const sortedCards = (user?.posts || []).sort(
    (a: { created_at: string }, b: { created_at: string }) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <Profile
      username={user?.name || "Usuario"}
      followers={followsData?.followers || []}
      followings={followsData?.followings || []}
      address={user?.address || ""}
      description={user?.description || ""}
      profilePicture={user?.profile_picture}
      bannerPicture={user?.banner_picture}
      cards={sortedCards}
      likes={likesData || []}
      services={user?.services ?? ""}
      prices={user?.prices ?? ""}
      terms={user?.terms ?? ""}
      userId={user?.id}
      buyMeACoffee={user?.buymeacoffee_link || ""} 
      isPremium={user?.is_premium ?? false}
    />
  );
}
