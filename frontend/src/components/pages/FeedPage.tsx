import React, { useState, useEffect } from "react";
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
      <div className="columns-4 gap-6 max-xl:columns-3 max-lg:columns-2 max-md:columns-1">
        {publications.map((pub) => (
          <div
            key={pub.id}
            className="break-inside-avoid mb-6 relative bg-stone-800 rounded-xl overflow-hidden"
          >
            {/* Imagen con iconos superpuestos */}
            <div className="relative w-full flex items-center justify-center transition-all duration-300">
              {pub.image ? (
                <img
                  src={pub.image}
                  alt={pub.description}
                  className="w-full object-contain rounded-xl"
                />
              ) : (
                <div className="w-full h-60 bg-gray-600 flex items-center justify-center text-gray-300 text-xs">
                  Sin imagen
                </div>
              )}

              {/* Iconos */}
              <div className="absolute bottom-3 right-3 flex flex-col gap-2 p-2 rounded-2xl ">

                {/* Perfil */}
                <button
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-black transition-transform duration-300 hover:scale-110"
                  title={`Ir al perfil de ${pub.user_name}`}
                  onClick={() => {
                    showToast("Redirigir al perfil aún no implementado", "info");
                  }}
                >
                  <img
                    src={
                      pub.user_profile_picture ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    alt={pub.user_name}
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Botón Seguir/Ya seguido */}
                {pub.user_id && (
                  <div
                    className={` absolute top-5 right-0 transform transition-all duration-500 ease-in-out ${hideFollow[pub.user_id]  ? "opacity-0 scale-0 pointer-events-none" : "opacity-100 scale-70"
                      }`}
                  >
                    <button
                      className="text-pink-500 hover:scale-110 text-lg font-semibold px-2 rounded-full bg-white"
                      title="Seguir"
                      onClick={() => {
                        setHideFollow(prev => ({ ...prev, [pub.user_id!]: true }));
                        toggleFollow(pub.user_id!);
                      }}
                    >
                      +
                    </button>
                  </div>
                )}

                {/* Like */}
                <button
                  className="text-white opacity-80 hover:scale-110 flex flex-col items-center"
                  title="Like"
                  onClick={() => toggleLike(pub.id)}
                >
                  {likes[pub.id] ? (
                    <svg
                      width="24"
                      height="24"
                      fill="red"
                      stroke="#fff"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21s-1-.5-2-1.5S5 14 5 10.5 8 5 12 8s7-2 7 2.5-5 9-5 9-1 1-2 1z" />
                    </svg>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21s-1-.5-2-1.5S5 14 5 10.5 8 5 12 8s7-2 7 2.5-5 9-5 9-1 1-2 1z" />
                    </svg>
                  )}
                  <span className="text-xs mt-1">{likesCount[pub.id] || 0}</span>
                </button>

                {/* Botón para abrir el modal */}
                <button
                  className="text-white opacity-80"
                  title="Comentar"
                  onClick={() => setIsModalOpen(pub.id)}
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal */}
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
                          showToast(
                            "El comentario no puede estar vacío",
                            "error"
                          );
                        }
                      }}
                    >
                      Publicar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Nombre del autor y descripción */}
            <div className="px-2 py-1">
              <span className="text-xs text-gray-200 font-semibold">
                {pub.user_name || "Usuario"}
              </span>
              <p className="text-gray-300 text-xs mt-1">{pub.description}</p>

              {/* Comentarios */}
              {comments[pub.id]?.length > 0 && (
                <div className="mt-1 text-xs text-gray-400">
                  {comments[pub.id].map((c, i) => (
                    <p key={i}>- {c}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
