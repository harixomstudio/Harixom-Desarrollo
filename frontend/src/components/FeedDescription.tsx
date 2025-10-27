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
      if (part.startsWith("@")) {
        const username = part.substring(1);

        return (
          <span
            key={index}
            className="text-pink-400 font-semibold cursor-pointer hover:underline"
            onClick={(e) => {
              e.stopPropagation();

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
                      window.location.href = `/ProfileGuest?userId=${user.id}`;
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

      // Hashtags
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

      return part;
    });
  };

  return (
    <p className="text-gray-300 text-sm mt-2 break-words"
       style={{ fontFamily: "Montserrat" }}>
      {parseText(pub.description || "")}
    </p>
  );
}