import { useState, useEffect } from "react";
import { useToast } from "../ui/Toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface DigitalArtPublication {
  id: number;
  description: string;
  image?: string;
  user_name?: string;
  user_profile_picture?: string;
  total_likes?: number;
  total_comments?: number;
  user_id?: number;
  is_following?: boolean;
  category?: string;
}

interface DigitalArtPageProps {
  digitalArtPublications: DigitalArtPublication[];
}

export default function FeedPage({
  digitalArtPublications,
}: DigitalArtPageProps) {
  const token = localStorage.getItem("access_token");
  const { showToast } = useToast();

  // Estados principales
  const [isModalOpen, setIsModalOpen] = useState<number | null>(null);
  const [currentComment, setCurrentComment] = useState("");
  const [comments, setComments] = useState<{ [key: number]: string[] }>({});
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({});
  const [likesCount, setLikesCount] = useState<{ [key: number]: number }>({});
  const [follows, setFollows] = useState<{ [key: number]: boolean }>({});
  const [hideFollow, setHideFollow] = useState<{ [key: number]: boolean }>({});
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Likes del usuario logueado
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

  // Traer usuario actual
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(data.user.id);
      } catch (err) {
        console.error("Error cargando usuario actual", err);
      }
    };
    fetchCurrentUser();
  }, [token]);

  // Inicialización de likes, follows, comentarios
  useEffect(() => {
    if (userLikes) setLikes(userLikes);

    const fetchFollows = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/user/follows",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const newFollows: { [key: number]: boolean } = {};
        const newHideFollow: { [key: number]: boolean } = {};

        digitalArtPublications.forEach((pub) => {
          if (pub.user_id) {
            const isFollowing = data.followings.some(
              (f: any) => f.id === pub.user_id
            );
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

    // Inicializar comentarios y likes
    const initialComments: { [key: number]: string[] } = {};
    digitalArtPublications.forEach((pub) => {
      initialComments[pub.id] = Array(pub.total_comments || 0).fill("");
    });
    setComments(initialComments);

    const counts: { [key: number]: number } = {};
    digitalArtPublications.forEach((pub) => {
      counts[pub.id] = pub.total_likes || 0;
    });
    setLikesCount(counts);
  }, [userLikes, digitalArtPublications, token]);

  // Evita renderizar publicaciones hasta conocer el usuario actual
  if (currentUserId === null) {
    return <div className="text-white p-10">Cargando feed...</div>;
  }

  // Funciones
  const fetchComments = async (pubId: number) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/comment/${pubId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const formatted = data.comments.map(
        (c: any) => `${c.user.name}: ${c.comment}`
      );

      setComments((prev) => ({
        ...prev,
        [pubId]: formatted,
      }));
    } catch (err) {
      console.error(err);
      showToast("Error al cargar comentarios", "error");
    }
  };

  const toggleLike = async (id: number) => {
    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLikes((prev) => ({ ...prev, [id]: data.liked }));
      setLikesCount((prev) => ({ ...prev, [id]: data.total_likes }));
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFollows((prev) => ({ ...prev, [userId]: data.following }));
      setHideFollow((prev) => ({ ...prev, [userId]: data.following }));
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
        { headers: { Authorization: `Bearer ${token}` } }
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
      <div className="flex items-center gap-3 mb-8">
        <img
          src="./public/icon-digitalart.svg"
          alt="Digital Art Icon"
          className="w-15 h-15 mt-2"
        />
        <span className="text-pink-400 text-4xl font-bold">Digital Art</span>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {digitalArtPublications.map((pub) => (
          <div
            key={pub.id}
            className="bg-[#151515] rounded-2xl overflow-hidden flex flex-col w-[340px] h-[460px]"
          >
            {/* Imagen */}
            <div className="relative w-full h-[340px] aspect-square flex items-center justify-center">
              {/* Avatar y nombre */}
              <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                <img
                  src={
                    pub.user_profile_picture ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt={pub.user_name}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <span className="text-white font-semibold text-sm drop-shadow">
                  {pub.user_name || "ArtistUser"}
                </span>
              </div>
              {pub.image ? (
                <img
                  src={pub.image}
                  alt={pub.description}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-500 flex items-center justify-center text-gray-300 text-xs" />
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-row justify-between items-center px-4 py-5 bg-[#151515]">
              <div className="flex flex-row gap-5 items-center">
                {/* Like */}
                <button
                  className={`opacity-80 flex flex-row items-center gap-1 ${
                    likes[pub.id] ? "text-red-500" : "text-gray-300"
                  }`}
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

                {/* Comentario */}
                <button
                  className="text-gray-300 opacity-80 flex flex-row items-center gap-1"
                  title="Comentar"
                  onClick={() => {
                    setIsModalOpen(pub.id);
                    fetchComments(pub.id);
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="text-xs">
                    {comments[pub.id]?.length || 0}
                  </span>
                </button>

                {/* Seguir (oculto si es el mismo user) */}
                {pub.user_id !== undefined && pub.user_id !== currentUserId && (
                  <button
                    className={`opacity-80 flex items-center justify-center ${
                      follows[pub.user_id] ? "text-green-500" : "text-gray-300"
                    }`}
                    title={follows[pub.user_id] ? "Siguiendo" : "Seguir"}
                    onClick={() => toggleFollow(pub.user_id!)}
                  >
                    {follows[pub.user_id] ? (
                      // ✅ Check
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#db2a83ff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="17 9 11 17 6 13" />
                      </svg>
                    ) : (
                      // ✚ Cruz
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="7" x2="12" y2="17" />
                        <line x1="7" y1="12" x2="17" y2="12" />
                      </svg>
                    )}
                  </button>
                )}
                {/* Categoría */}
                <span className="ml-17 text-gray-300 font-bold">
                  {pub.category}
                </span>
              </div>
            </div>

            {/* Descripción */}
            <div className="px-4 pb-6">
              <span className="text-base text-white font-bold block">
                {pub.description || "Sin título"}
              </span>
            </div>

            {/* Modal comentarios */}
            {isModalOpen === pub.id && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-stone-800 rounded-lg p-6 shadow-lg w-96 max-h-[80vh] flex flex-col">
                  <h2 className="text-white text-lg font-semibold mb-4">
                    Comentarios
                  </h2>
                  <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                    {comments[pub.id]?.length ? (
                      comments[pub.id].map((comment, i) => (
                        <div
                          key={i}
                          className="bg-stone-900 text-gray-200 p-2 rounded-md border border-stone-700 shadow-sm"
                        >
                          {comment}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">
                        No hay comentarios aún
                      </p>
                    )}
                  </div>
                  <textarea
                    value={currentComment}
                    onChange={(e) => setCurrentComment(e.target.value)}
                    placeholder="Escribe tu comentario..."
                    className="w-full bg-stone-900 text-gray-200 p-3 rounded-lg resize-none 
                      focus:outline-none focus:ring-2 focus:ring-pink-400 
                      border border-stone-700 shadow-md placeholder:text-pink-300"
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
                          await fetchComments(pub.id);
                          setCurrentComment("");
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
          </div>
        ))}
      </div>
    </div>
  );
}
