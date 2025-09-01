import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import ProfilePage from "../components/pages/ProfilePage";

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
      if (!response.ok) {
        throw new Error("Error al obtener el perfil");
      }
      return response.json();
    },
    enabled: !!token, // solo corre si hay token
  });

  if (!token) return <p className="text-white text-center mt-10">No estás logueado.</p>;
  if (isLoading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{(error as Error).message}</p>;

  const user = data?.user;

  return (
    <ProfilePage
      username={user?.name || "Usuario"}
      followers={user?.followers || 0}
      address={user?.address || ""}
      description={user?.description || ""}
      profilePicture={user?.profile_picture}
      bannerPicture={user?.banner_picture}
      cards={user?.posts || []}
    />
  );
}
