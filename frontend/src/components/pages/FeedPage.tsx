import React, { useState } from "react";
import { useToast } from "../ui/Toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Publication {
  id: number;
  description: string;
  image?: string;
  user_name?: string;
  user_profile_picture?: string; // URL de la foto del usuario
  total_likes?: number;
  user_id?: number;
  is_following?: boolean;
  category?: string;
}

interface FeedPageProps {
  publications: Publication[];
}

export default function FeedPage({ publications }: FeedPageProps) {
  const token = localStorage.getItem("access_token");
  const { showToast } = useToast();

  const { data: userLikes } = useQuery({
    queryKey: ["userLikes"],
    queryFn: async () => {
      const { data } = await axios.get("http://127.0.0.1:8000/api/user/likes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const likesMap: { [key: number]: boolean } = {};
      data.likes.forEach((like: any) => {
        likesMap[like.id] = true;
      });
      return likesMap;
    },
    staleTime: 1000 * 60,
  });

  const [isModalOpen, setIsModalOpen] = useState<number | null>(null); // Controla qué publicación tiene el modal abierto
  const [currentComment, setCurrentComment] = useState(""); // Texto del comentario
  const [comments, setComments] = useState<{ [key: number]: string[] }>({}); // Comentarios por publicación
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({});
  const [likesCount, setLikesCount] = useState<{ [key: number]: number }>({});
  const [follows, setFollows] = useState<{ [key: number]: boolean }>({});
  const [hideFollow, setHideFollow] = useState<{ [key: number]: boolean }>({});

  React.useEffect(() => {
    // Inicializar likes
    if (userLikes) setLikes(userLikes);

    // Inicializar follows
    const fetchFollows = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/user/follows",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const newFollows: { [key: number]: boolean } = {};
        const newHideFollow: { [key: number]: boolean } = {};

        publications.forEach(pub => {
          if (pub.user_id) {
            const isFollowing = data.followings.some((f: any) => f.id === pub.user_id);
            newFollows[pub.user_id] = isFollowing;
            newHideFollow[pub.user_id] = isFollowing;
          }
        });

        setFollows(newFollows);
        setHideFollow(newHideFollow);

      } catch (err) {
        console.error("Error cargando follows:", err);
      }
    };

    fetchFollows();

    const counts: { [key: number]: number } = {};
    publications.forEach(pub => {
      counts[pub.id] = pub.total_likes || 0;
    });
    setLikesCount(counts);
  }, [userLikes, publications]);

  const toggleLike = async (id: number) => {
    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/like/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);///////////////////////////////////////
      setLikes(prev => ({ ...prev, [id]: data.liked }));
      setLikesCount(prev => ({ ...prev, [id]: data.total_likes }));
    } catch (error) {
      console.error(error);
      showToast("Error al hacer like", "error");
    }
  };

  const toggleFollow = async (userId: number) => {
    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/follow/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFollows((prev) => ({ ...prev, [userId]: data.following }));
      setHideFollow(prev => ({ ...prev, [userId]: data.following }));
    } catch (err) {
      console.error(err);
      showToast("Error al seguir", "error");
    }
  };

  const addComment = async (id: number, text: string) => {
    if (!text.trim()) {
      showToast("El comentario no puede estar vacío", "error");
      return;
    }

    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/comment/${id}`,
        { comment: text },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments((prev) => ({
        ...prev,
        [id]: [
          ...(prev[id] || []),
          `${data.comment.user.name}: ${data.comment.comment}`,
        ],
      }));

      showToast("¡Comentario publicado!", "success");
    } catch (err) {
      console.error(err);
      showToast("Error al publicar el comentario", "error");
    }
  };

  return (
    <div className="bg-stone-950 min-h-screen p-10">
      <div className="grid grid-cols-4 gap-6">
        {publications.map((pub) => (
          <div
            key={pub.id}
            className="bg-[#151515] rounded-2xl overflow-hidden flex flex-col w-[340px] h-[460px]"
          >
            {/* Imagen */}
            <div className="relative w-full h-[340px] aspect-square flex items-center justify-center">
              {/* Avatar y nombre sobre la imagen */}
              <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                <img
                  src={pub.user_profile_picture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                  alt={pub.user_name}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <span className="text-white font-semibold text-sm drop-shadow">
                  {pub.user_name || "ArtistUser"}
                </span>
              </div>
              {/* Imagen principal */}
              {pub.image ? (
                <img
                  src={pub.image}
                  alt={pub.description}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-500 flex items-center justify-center text-gray-300 text-xs">
                  {/* Placeholder */}
                </div>
              )}
            </div>
            {/* Footer estilo Instagram */}
            <div className="flex flex-row justify-between items-center px-4 py-5 bg-[#151515]">
              <div className="flex flex-row gap-5 items-center">
                {/* Botón like */}
                <button
                  className={`opacity-80 flex flex-row items-center gap-1 ${likes[pub.id] ? "text-red-500" : "text-gray-300"}`}
                  title="Like"
                  onClick={() => toggleLike(pub.id)}
                >
                  <svg
                    width="28"
                    height="28"
                    fill={likes[pub.id] ? "red" : "none"}
                    stroke="white"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21s-1-.5-2-1.5S5 14 5 10.5 8 5 12 8s7-2 7 2.5-5 9-5 9-1 1-2 1z" />
                  </svg>
                  <span className="text-xs">{likesCount[pub.id] || 0}</span>
                </button>
                {/* Botón comentario */}
                <button
                  className="text-gray-300 opacity-80 flex flex-row items-center gap-1"
                  title="Comentar"
                  onClick={() => setIsModalOpen(pub.id)}
                >
                  <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="text-xs">{comments[pub.id]?.length || 0}</span>
                </button>
                {/* Botón seguir */}
                <button
                  className={`opacity-80 flex items-center justify-center ${follows[pub.user_id!] ? "text-pink-500" : "text-gray-300"}`}
                  title={follows[pub.user_id!] ? "Siguiendo" : "Seguir"}
                  onClick={() => toggleFollow(pub.user_id!)}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={follows[pub.user_id!] ? "#ec4899" : "white"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </button>
                {/* Categoría */}
                <span className="ml-17  text-gray-300 font-bold">
                  {pub.category}
                </span>
              </div>
            </div>
            {/* Nombre de la obra debajo de los botones */}
            <div className="px-4 pb-6">
              <span className="text-base text-white font-bold block">
                {pub.description || "Sin título"}
              </span>
            </div>
            {/* Modal de comentarios */}
            {isModalOpen === pub.id && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-stone-800 rounded-lg p-6 shadow-lg w-96">
                  <h2 className="text-white text-lg font-semibold mb-4">
                    Escribe tu comentario:
                  </h2>
                  <textarea
                    value={currentComment}
                    onChange={(e) => setCurrentComment(e.target.value)}
                    placeholder="Escribe tu comentario..."
                    className="w-full bg-stone-900 text-gray-200 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 border border-stone-700 shadow-md placeholder:text-pink-300"
                    rows={3}
                  />
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
                      onClick={() => {
                        setIsModalOpen(null);
                        setCurrentComment("");
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white"
                      onClick={async () => {
                        if (currentComment.trim()) {
                          await addComment(pub.id, currentComment);
                          setIsModalOpen(null);
                          setCurrentComment("");
                          showToast("¡Comentario publicado!", "success");
                        } else {
                          showToast("El comentario no puede estar vacío", "error");
                        }
                      }}
                    >
                      Publicar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
