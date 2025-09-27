import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Profile from "../components/pages/ProfilePage";
import axios from "axios";

export const Route = createFileRoute("/Profile")({
  component: ProfileRoute,
});

function ProfileRoute() {
  const token = localStorage.getItem("access_token");

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data } = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    enabled: !!token,
  });

  const { data: likesData } = useQuery({
    queryKey: ["userLikes"],
    queryFn: async () => {
      const { data } = await axios.get("http://127.0.0.1:8000/api/user/likes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.likes;
    },
    enabled: !!token,
  });

  const { data: followsData } = useQuery({
  queryKey: ["userFollows"],
  queryFn: async () => {
    const { data } = await axios.get("http://127.0.0.1:8000/api/user/follows", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
  enabled: !!token,
});

  if (!token) return <p className="text-white text-center mt-10">No estás logueado.</p>;
  if (isLoading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{(error as Error).message}</p>;

  const user = profileData.user;
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
    />
  );
}
