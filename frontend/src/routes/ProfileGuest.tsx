import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProfileGuestPage from "../components/pages/ProfileGuestPage";

export const Route = createFileRoute("/ProfileGuest")({
  component: ProfileGuestRoute,
});

function ProfileGuestRoute() {
  const token = localStorage.getItem("access_token");

  // Obtener el userId desde el query string
  const searchParams = new URLSearchParams(window.location.search);
  const guestUserId = searchParams.get("userId");

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ["guestProfile", guestUserId],
    queryFn: async () => {
      const { data } = await axios.get(`http://127.0.0.1:8000/api/users/${guestUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    enabled: !!token && !!guestUserId,
  });

  // Likes y follows del invitado
  const { data: likesData } = useQuery({
    queryKey: ["guestLikes", guestUserId],
    queryFn: async () => {
      const { data } = await axios.get(`http://127.0.0.1:8000/api/users/${guestUserId}/likes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.likes;
    },
    enabled: !!token && !!guestUserId,
  });

  const { data: followsData } = useQuery({
    queryKey: ["guestFollows", guestUserId],
    queryFn: async () => {
      const { data } = await axios.get(`http://127.0.0.1:8000/api/users/${guestUserId}/follows`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    enabled: !!token && !!guestUserId,
  });

  if (!guestUserId) return <p className="text-white text-center mt-10">Usuario no especificado.</p>;
  if (isLoading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{(error as Error).message}</p>;

  const user = profileData.user;
  const sortedCards = (user?.posts || []).sort(
    (a: { created_at: string }, b: { created_at: string }) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <ProfileGuestPage
      username={user?.name || "Usuario"}
      followers={followsData?.followers || []}
      followings={followsData?.followings || []}
      address={user?.address || ""}
      description={user?.description || ""}
      profilePicture={user?.profile_picture}
      bannerPicture={user?.banner_picture}
      cards={sortedCards}
      likes={likesData || []}
      userId={user?.id}
    />
  );
}