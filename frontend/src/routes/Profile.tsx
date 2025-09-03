import type React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Profile from "../components/pages/Profile";

export const Route = createFileRoute("/Profile")({
  component: ProfileRoute,
});

function ProfileRoute() {
  const token = localStorage.getItem("access_token");

  const { data, isLoading, error } = useQuery({
  queryKey: ["userProfile"],
  queryFn: async () => {
    const response = await fetch("http://127.0.0.1:8000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error("Error al obtener el perfil");
    const json = await response.json();
    // Asegúrate de que `json.user.posts` contenga las publicaciones
    return json;
  },
  enabled: !!token,
});

  if (!token) return <p className="text-white text-center mt-10">No estás logueado.</p>;
  if (isLoading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{(error as Error).message}</p>;

  const user = data?.user;
  
  const sortedCards = (user?.posts || []).sort(
  (a: { description: string; image?: string; created_at: string }, b: { description: string; image?: string; created_at: string }) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
);

  return (
    <Profile
      username={user?.name || "Usuario"}
      followers={user?.followers || 0}
      address={user?.address || ""}
      description={user?.description || ""}
      profilePicture={user?.profile_picture}
      bannerPicture={user?.banner_picture}
      cards={sortedCards}
    />
  );
}
