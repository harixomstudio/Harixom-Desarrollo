import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useToast } from "../ui/Toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import WatermarkedImage from "../ui/WaterMarkedImage";
import FeedDescription from "../FeedDescription";

interface Publication {
  id: number;
  description: string;
  image?: string;
  user_name?: string;
  isPremium?: boolean;
  user_profile_picture?: string;
  total_likes?: number;
  total_comments?: number;
  user_id?: number;
  is_following?: boolean;
  category?: string;
  created_at?: string;
}

interface FeedPageProps {
  publications: Publication[];
}

const API_URL = "https://harixom-desarrollo.onrender.com/api";

const apiGet = async (url: string, token: string) => {
  const { data } = await axios.get(`${API_URL}/${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const apiPost = async (url: string, body: any, token: string) => {
  const { data } = await axios.post(`${API_URL}/${url}`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export default function FeedPage({ publications }: FeedPageProps) {
  const token = localStorage.getItem("access_token")!;
  const { showToast } = useToast();
  const navigate = useNavigate();
  

  const [isModalOpen, setIsModalOpen] = useState<number | null>(null);
  const [currentComment, setCurrentComment] = useState("");
  const [comments, setComments] = useState<Record<number, string[]>>({});
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [likesCount, setLikesCount] = useState<Record<number, number>>({});
  const [follows, setFollows] = useState<Record<number, boolean>>({});
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [animatingLikeId, setAnimatingLikeId] = useState<number | null>(null);


  // Scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        setVisibleCount((prev) => prev + 12);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Funciones para abrir y cerrar el modal
  const openModal = (publication: Publication) => {
    setSelectedPublication(publication);
  };

  const closeModal = () => {
    setSelectedPublication(null);
  };

  // Likes del usuario logueado
  const { data: userLikes } = useQuery({
    queryKey: ["userLikes"],
    queryFn: async () => {
      const { data } = await axios.get("https://harixom-desarrollo.onrender.com/api/user/likes", {
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

  // Inicializa usuario actual y follows
  useEffect(() => {
    const initUserData = async () => {
      try {
        const [userRes, followRes] = await Promise.all([
          apiGet("user", token),
          apiGet("user/follows", token),
        ]);

        const uid = userRes.user.id;
        setCurrentUserId(uid);

        const newFollows: Record<number, boolean> = {};
        publications.forEach((pub) => {
          if (pub.user_id)
            newFollows[pub.user_id] = followRes.followings.some(
              (f: any) => f.id === pub.user_id
            );
        });
        setFollows(newFollows);
      } catch (err) {
        console.error("Error cargando usuario o follows", err);
      }
    };
    initUserData();
  }, [token, publications]);

  // Inicializa likes y comentarios
  useEffect(() => {
    if (userLikes) setLikes(userLikes);

    const initialLikes = publications.reduce((acc, pub) => {
      acc[pub.id] = pub.total_likes || 0;
      return acc;
    }, {} as Record<number, number>);

    const initialComments = publications.reduce((acc, pub) => {
      acc[pub.id] = Array(pub.total_comments || 0).fill("");
      return acc;
    }, {} as Record<number, string[]>);

    setLikesCount(initialLikes);
    setComments(initialComments);
  }, [userLikes, publications]);

  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("es-CR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  }, []);

  const fetchComments = useCallback(async (pubId: number) => {
    try {
      const data = await apiGet(`comment/${pubId}`, token);
      setComments((prev) => ({
        ...prev,
        [pubId]: data.comments.map((c: any) => `${c.user.name}: ${c.comment}`),
      }));
    } catch {
      showToast("Error al cargar comentarios", "error");
    }
  }, [token, showToast]);

  const toggleLike = useCallback(async (id: number, for_user_id: number) => {
    try {
      const data = await apiPost(
        `like/${id}`,
        { title: "¡Te han dado like!", for_user_id, status: "Low" },
        token
      );
      setLikes((prev) => ({ ...prev, [id]: data.liked }));
      setLikesCount((prev) => ({ ...prev, [id]: data.total_likes }));
      setAnimatingLikeId(id);
      setTimeout(() => setAnimatingLikeId(null), 600);
    } catch {
      showToast("Error al hacer like", "error");
    }
  }, [token, showToast]);

  const toggleFollow = useCallback(async (userId: number) => {
    try {
      const data = await apiPost(
        `follow/${userId}`,
        { title: "¡Te han empezado a seguir!", status: "Medium" },
        token
      );
      setFollows((prev) => ({ ...prev, [userId]: data.following }));
      showToast("¡Ahora sigues a este usuario!", "success");
    } catch {
      showToast("Error al seguir", "error");
    }
  }, [token, showToast]);

  const addComment = useCallback(
    async (id: number, text: string, for_user_id: number) => {
      if (!text.trim()) return showToast("El comentario no puede estar vacío", "error");

      try {
        const data = await apiPost(
          `comment/${id}`,
          {
            title: "¡Te han enviado un comentario!",
            comment: text,
            for_user_id,
            status: "Low",
          },
          token
        );
        setComments((prev) => ({
          ...prev,
          [id]: [...(prev[id] || []), `${data.comment.user.name}: ${data.comment.comment}`],
        }));
        showToast("¡Comentario publicado!", "success");
      } catch {
        showToast("Error al publicar el comentario", "error");
      }
    },
    [token, showToast]
  );

  useEffect(() => {
    if (selectedPublication) {
      fetchComments(selectedPublication.id);
    }
  }, [selectedPublication, fetchComments]);

  if (!currentUserId)
    return (
      <div className="flex bg-stone-950 text-white items-center h-full justify-center pb-20">
        <div className="flex space-x-3">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-${0.3 * (3 - i)}s]`}
              />
            ))}
        </div>
      </div>
    );

  return (
    <div className="bg-stone-950 min-h-screen py-10 px-3"
      style={{ fontFamily: "Montserrat" }}>
      <style>
        {`
    @keyframes heart-wow {
      0% {
        transform: scale(1);
        filter: brightness(1);
      }
      25% {
        transform: scale(1.5);
        filter: brightness(2);
      }
      50% {
        transform: scale(0.9);
        filter: brightness(1.5);
      }
      75% {
        transform: scale(1.2);
        filter: brightness(1.2);
      }
      100% {
        transform: scale(1);
        filter: brightness(1);
      }
    }

    .animate-wow {
      animation: heart-wow 0.6s ease-out;
    }
  `}
      </style>
      <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-1 max-xl:grid-cols-2 max-lg:items-center max-xl:flex max-xl:flex-wrap max-xl:justify-around ">
        {publications.slice(0, visibleCount).map((pub) => (
          <div
            key={pub.id}
            onClick={() => openModal(pub)}
            
            className="bg-gradient-to-b from-[#131313] to-[#070707] rounded-xl overflow-hidden flex flex-col w-[340px] h-[460px] 
cursor-pointer transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-pink-500/20 border-1 border-stone-800"
>

            {/* Imagen */}
            <div
              className="relative w-full h-[340px] aspect-square flex items-center justify-center cursor-pointer "
              onClick={() => openModal(pub)}
            >
              {/* Avatar y nombre */}
              <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                <img
                  src={
                    pub.user_profile_picture ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt={pub.user_name}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (pub.user_id === currentUserId) {
                      navigate({ to: "/Profile" });
                    } else {
                      navigate({
                        to: "/ProfileGuest",
                        search: { userId: pub.user_id },
                      });
                    }
                  }}
                />

                <span
                  className="text-white font-semibold text-sm drop-shadow hover:text-pink-400 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (pub.user_id === currentUserId) {
                      navigate({ to: "/Profile" });
                    } else {
                      navigate({
                        to: "/ProfileGuest",
                        search: { userId: pub.user_id },
                      });
                    }
                  }}
                >
                  <div className="flex items-center gap-1">

                    <span
                      className="text-white font-semibold text-sm drop-shadow hover:text-pink-400 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (pub.user_id === currentUserId) {
                          navigate({ to: "/Profile" });
                        } else {
                          navigate({
                            to: "/ProfileGuest",
                            search: { userId: pub.user_id },
                          });
                        }
                      }}
                    >
                      {pub.user_name || "ArtistUser"}
                    </span>


                    {pub.isPremium && (
                      <img src="/premium.svg" alt="Insignia Premium" className="w-4 h-4" />
                    )}
                  </div>

                </span>
              </div>
              {pub.image ? (
                <WatermarkedImage
                  src={pub.image}
                  alt={pub.description}
                  className="w-100px h-full object-cover rounded-lg max-lg:w-4/5"
                  watermarkText={`Propiedad de ${pub.user_name || "Usuario desconocido"}`}
                />
              ) : (
                <div className="w-full h-full bg-gray-500 flex items-center justify-center text-gray-300 text-xs" />
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-row justify-between items-center px-4 py-5 bg-[#0b0b0b]">
              <div className="flex flex-row gap-3 items-center">
                {/* Like */}
                <button
                  className={`flex items-center gap-1 group transition-colors duration-200 ${likes[pub.id] ? "text-pink-500" : "text-gray-300"
                    }`}
                  title="Like"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAnimatingLikeId(pub.id); // activa animación
                    if (typeof pub.user_id === "number") {
                      toggleLike(pub.id, pub.user_id);
                    }
                    setTimeout(() => setAnimatingLikeId(null), 600); // limpia animación
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill={likes[pub.id] ? "#ec4899" : "none"}
                    stroke={likes[pub.id] ? "#ec4899" : "white"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-all duration-200 group-hover:stroke-pink-500 ${animatingLikeId === pub.id ? "animate-wow" : ""
                      }`}
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="text-xs transition-colors duration-200 group-hover:text-pink-500">
                    {likesCount[pub.id] || 0}
                  </span>
                </button>


                {/* Comentario */}
                <button
                  className="flex items-center gap-1 group transition-colors duration-200 text-gray-300 opacity-80"
                  title="Comentar"
                  onClick={(e) => {
                    e.stopPropagation();
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
                    className="transition-colors duration-200 group-hover:stroke-pink-500"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="text-xs transition-colors duration-200 group-hover:text-pink-500">
                    {comments[pub.id]?.length || 0}
                  </span>
                </button>



                {/* Seguir (oculto si es el mismo user) */}
                {pub.user_id !== undefined && pub.user_id !== currentUserId && (
                  <button
                    className={`flex items-center justify-center opacity-80 transition-colors duration-200 group
      ${follows[pub.user_id] ? "text-pink-500" : "text-gray-300"}`}
                    title={follows[pub.user_id] ? "Siguiendo" : "Seguir"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollow(pub.user_id!);
                    }}
                  >
                    {follows[pub.user_id] ? (
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#db2a83ff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-colors duration-200 group-hover:stroke-pink-500"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="17 9 11 17 6 13" />
                      </svg>
                    ) : (
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-colors duration-200 group-hover:stroke-pink-500"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="7" x2="12" y2="17" />
                        <line x1="7" y1="12" x2="17" y2="12" />
                      </svg>
                    )}
                  </button>
                )}



                {/* Categoría */}
                
             {pub.category && (
              <span className="ml-10 text-gray-300 font-bold border-2 border-gray-500 rounded-full p-2 text-xs hover:border-pink-500">
               <Link
                    to="/Categories/$name"
                    params={{ name: pub.category }}>
                   {pub.category}
               </Link>
               </span>
              )}

                 
              </div>
            </div>

            {/* Descripción */}
            <div className="px-4 pb-6">
              <FeedDescription pub={pub} currentUserId={currentUserId} />
            </div>

            {/* Modal comentarios */}
            {isModalOpen === pub.id && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-stone-800 rounded-lg p-6 shadow-lg w-96 max-h-[80vh] flex flex-col">
                  <h2
                    className="text-white text-lg font-semibold mb-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Comments
                  </h2>
                  <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                    {comments[pub.id]?.length ? (
                      comments[pub.id].map((comment, i) => (
                        <div
                          key={i}
                          className="bg-stone-900 text-gray-200 p-2 rounded-md border border-stone-700 shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {comment}
                        </div>
                      ))
                    ) : (
                      <p
                        className="text-gray-400 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        No commets yet
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
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsModalOpen(null);
                        setCurrentComment("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (currentComment.trim()) {
                          await addComment(pub.id, currentComment, publications.find((p) => p.id === pub.id)?.user_id!);
                          await fetchComments(pub.id);
                          setIsModalOpen(null);
                          setCurrentComment("");
                        } else {
                          showToast(
                            "El comentario no puede estar vacío",
                            "error"
                          );
                        }
                      }}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {visibleCount < publications.length ? ( // esto es el loading se activa al scrollear
        <div className="flex justify-center pt-10 pb-15">
          <div className="flex space-x-3">
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.6s]"></div>
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      ) : <div className="flex space-x-1 items-baseline text-gray-400 text-sm text-center justify-center pb-5 pt-10"> WAITING FOR NEW POSTS
        <p className="animate-pulse [animation-delay:-0.8s] text-2xl pl-1">.</p>
        <p className="animate-pulse [animation-delay:-0.3s] text-2xl">.</p>
        <p className="animate-pulse text-2xl" >.</p>
      </div>}

      {/* Modal publicaciones en grande */}
      {selectedPublication && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 max-lg:h-screen">
          <div className="relative bg-[#151515] rounded-lg p-6 shadow-lg w-[90vw] h-[90vh] overflow-auto flex max-lg:flex-col max-lg:w-3/4 max-lg:h-3/4 max-lg:items-center">

            {/* Botón de cierre */}
            <button
              onClick={closeModal}
              className="absolute lg:top-6 lg:right-6 max-lg:top-4 max-lg:right-4 px-3 py-1 bg-red-500 text-white rounded-full font-bold text-lg hover:bg-red-600 transition-all shadow-md z-20"
            >
              ✕
            </button>

            {/* Imagen a la izquierda */}
            <div className="w-2/3 h-full flex items-center justify-center max-lg:h-1/2 max-lg:w-full">
              {selectedPublication.image ? (
                <WatermarkedImage
                  src={selectedPublication.image}
                  alt={selectedPublication.description}
                  className="w-100px h-full object-cover rounded-lg max-lg:w-4/5"
                  watermarkText={`Propiedad de ${selectedPublication.user_name || "Usuario desconocido"}`}
                />
              ) : (
                <div className="w-full h-full bg-gray-500 flex items-center justify-center text-gray-300 text-xs">
                  Sin imagen
                </div>
              )}
            </div>

            {/* Información a la derecha */}
            <div className="w-1/3 flex flex-col justify-between max-lg:justify-center max-lg:w-4/5 max-lg:flex-col max-lg:pt-10 mx-4">
              <div>
                <div className="flex items-center">
                  <h2 className="text-white text-3xl font-bold">
                    {selectedPublication.user_name || "Usuario desconocido"}
                  </h2>

                  {/* Seguir */}
                  {selectedPublication.user_id !== currentUserId && (
                    <button
                      className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors duration-200 hover:text-pink-500 ${follows[selectedPublication.user_id || 0] ? "text-pink-500" : "text-gray-300 bg-stone-900/30"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(selectedPublication.user_id!);
                      }}
                      title={follows[selectedPublication.user_id || 0] ? "Siguiendo" : "Seguir"}
                    >
                      {follows[selectedPublication.user_id || 0] ? (
                        <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="17 9 11 17 6 13" />
                        </svg>
                      ) : (
                        <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="7" x2="12" y2="17" />
                          <line x1="7" y1="12" x2="17" y2="12" />
                        </svg>
                      )}
                      <span className="text-sm font-semibold">{follows[selectedPublication.user_id || 0] ? "" : ""}</span>
                    </button>
                  )}
                </div>

                {/* Like + contador */}
                <div className="flex items-center gap-4 mt-6">
                  <button
                    className={`flex items-center gap-2 hover:text-pink-500 ${likes[selectedPublication.id] ? "text-pink-500" : "text-gray-300"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (typeof selectedPublication.user_id === "number") {
                        toggleLike(selectedPublication.id, selectedPublication.user_id);
                      }
                      setAnimatingLikeId(selectedPublication.id);
                      setTimeout(() => setAnimatingLikeId(null), 600);
                    }}
                    title="Like"
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill={likes[selectedPublication.id] ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${animatingLikeId === selectedPublication.id ? "animate-wow" : ""}`}>
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="text-sm group-hover:stroke-pink-500">{likesCount[selectedPublication.id] || 0}</span>
                  </button>
                </div>

                <p className="text-gray-400 text-sm mt-6">{formatDate(selectedPublication.created_at)}</p>

                <div className="mt-6">
                  <p className="text-gray-300 text-lg">
                    <FeedDescription pub={selectedPublication} currentUserId={currentUserId} />
                  </p>

                  <div className="mt-6">
                    <Link
                      to="/Categories/$name"
                      params={{ name: selectedPublication.category || "General" }}
                      className="px-4 py-2 bg-pink-500 text-white rounded-full text-sm hover:scale-105 transition-transform"
                    >
                      {selectedPublication.category || "Sin categoría"}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Comentarios (movidos al final para que queden abajo) */}
              <div className="mt-8 w-full">
                <h2 className="text-white text-lg font-semibold mb-3">Comentarios</h2>

                {/* Lista de comentarios */}
                <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto mb-4">
                  {comments[selectedPublication.id]?.length ? (
                    comments[selectedPublication.id].map((comment, i) => (
                      <div
                        key={i}
                        className="bg-stone-900 text-gray-200 p-2 rounded-md border border-stone-700 shadow-sm"
                      >
                        {comment}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No hay comentarios aún.</p>
                  )}
                </div>

                {/* Área para escribir nuevo comentario */}
                <div className="mt-2 flex flex-col gap-3">
                  <textarea
                    value={currentComment}
                    onChange={(e) => setCurrentComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="w-full bg-stone-900 text-gray-200 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 border border-stone-700 shadow-md placeholder:text-pink-300"
                    rows={3}
                  />

                  {/* Botón “Publicar” solo visible cuando hay texto */}
                  {currentComment.trim() !== "" && (
                    <div className="flex justify-end">
                      <button
                        className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white"
                        onClick={async () => {
                          if (!currentComment.trim()) {
                            return showToast("El comentario no puede estar vacío", "error");
                          }
                          await addComment(
                            selectedPublication.id,
                            currentComment,
                            selectedPublication.user_id!
                          );
                          await fetchComments(selectedPublication.id);
                          setCurrentComment("");
                        }}
                      >
                        Publicar
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
