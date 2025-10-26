import { useNavigate } from "@tanstack/react-router";
import axios from "axios";

export default function FeedDescription({ pub, currentUserId }: any) {
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");
  const axiosRequest = axios.create({
    baseURL: "https://harixom-desarrollo.onrender.com/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  const parseText = (text: string) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      // 👇 Detecta menciones
      if (part.startsWith("@")) {
        const username = part.substring(1);
        return (
          <span
            key={index}
            className="text-pink-400 font-semibold cursor-pointer hover:underline"
            onClick={(e) => {
              e.stopPropagation();

              // Si el usuario hace clic en su propio @nombre
              if (pub.user_id === currentUserId) {
                navigate({ to: "/Profile" });
                return;
              }

              // Buscar usuario por nombre usando /search
              axiosRequest
  .get(`/search?q=${username}`)
  .then((res) => {
    const users = res.data.users;
    const user = users.find(
      (u: any) =>
        u.name.toLowerCase() === username.toLowerCase()
    );

    if (user) {
      if (user.id === currentUserId) {
        navigate({ to: "/Profile" });
      } else {
        navigate({
          to: "/ProfileGuest",
          search: { userId: user.id },
        });
      }
    } else {
      console.warn(`Usuario @${username} no encontrado.`);
    }
  })
  .catch((err) => {
    console.error("Error al buscar usuario:", err);
  });
            }}
          >
            {part}
          </span>
        );
      }

      // 👇 Detecta hashtags
      if (part.startsWith("#")) {
        const tag = part.substring(1);
        return (
          <span
            key={index}
            className="text-blue-400 font-semibold cursor-pointer hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              if (tag.toLowerCase() === "retoharixom") {
                navigate({ to: "/AIChallenge" });
              }
            }}
          >
            {part}
          </span>
        );
      }

      // Texto normal
      return part;
    });
  };

  return (
    <p className="text-gray-300 text-sm mt-2 break-words">
      {parseText(pub.description || "")}
    </p>
  );
}