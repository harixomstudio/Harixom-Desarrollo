import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Profile from "../components/pages/ProfilePage";

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

      // Mapear posts para asegurarnos de que cada uno tenga un id
      const postsWithId = (json.user.posts || []).map(
        (post: any, index: number) => ({
          id: post.id ?? index, // si no hay id, usamos el índice como fallback
          description: post.description,
          image: post.image,
          created_at: post.created_at,
        })
      );

      return {
        ...json,
        user: {
          ...json.user,
          posts: postsWithId,
        },
      };
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

  const user = data?.user;

  // Ordenar las publicaciones por fecha
  const sortedCards = (user?.posts || []).sort(
    (a: { created_at: string }, b: { created_at: string }) =>
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
