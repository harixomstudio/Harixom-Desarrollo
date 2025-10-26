import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useToast } from "../ui/Toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import WatermarkedImage from "../ui/WaterMarkedImage";

interface Publication {
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
  created_at?: string;
}

interface FeedPageProps {
  publications: Publication[];
}

function FeedDescription({ pub, currentUserId }: any) {
  const navigate = useNavigate();

  const parseText = (text: string) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        return (
          <span
            key={index}
            className="text-pink-400 font-semibold cursor-pointer hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              if (pub.user_id === currentUserId) {
                //navigate({ to: "/Profile" });
              } else {
                // navigate({ to: "/ProfileGuest", search: { userId: pub.user_id }, });
                console.log("Perfil no reconocido:", pub.user_id);
              }
            }}
          >
            {part}
          </span>
        );
      }

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
              } else {
                console.log("Hashtag no reconocido:", tag);
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
    <p className="text-gray-300 text-sm mt-2 break-words">
      {parseText(pub.description || "")}
    </p>
  );
}

export default function FeedPage({ publications }: FeedPageProps) {
  const token = localStorage.getItem("access_token");
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Estados principales
  const [isModalOpen, setIsModalOpen] = useState<number | null>(null);
  const [currentComment, setCurrentComment] = useState("");
  const [comments, setComments] = useState<{ [key: number]: string[] }>({});
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({});
  const [likesCount, setLikesCount] = useState<{ [key: number]: number }>({});
  const [follows, setFollows] = useState<{ [key: number]: boolean }>({});
  const [, setHideFollow] = useState<{ [key: number]: boolean }>({});
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [selectedPublication, setSelectedPublication] =
    useState<Publication | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);


  useEffect(() => { //Despliegue de un feed infinito, scroll aparece cargando y aumentan las publicaciones
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        setVisibleCount((prevCount) => prevCount + 12);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [visibleCount]);

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

  // Traer usuario actual
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await axios.get("https://harixom-desarrollo.onrender.com/api/user", {
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
          "https://harixom-desarrollo.onrender.com/api/user/follows",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const newFollows: { [key: number]: boolean } = {};
        const newHideFollow: { [key: number]: boolean } = {};

        publications.forEach((pub) => {
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
    publications.forEach((pub) => {
      initialComments[pub.id] = Array(pub.total_comments || 0).fill("");
    });
    setComments(initialComments);

    const counts: { [key: number]: number } = {};
    publications.forEach((pub) => {
      counts[pub.id] = pub.total_likes || 0;
    });
    setLikesCount(counts);
  }, [userLikes, publications, token]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-CR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (currentUserId === null) {
    return (
      <div className="flex bg-stone-950 text-white items-center h-full justify-center pb-20">
        <div className="flex space-x-3">
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.6s]"></div>
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce "></div>
        </div>
      </div>
    );
  }

  // Funciones
  const fetchComments = async (pubId: number) => {
    try {
      const { data } = await axios.get(
        `https://harixom-desarrollo.onrender.com/api/comment/${pubId}`,
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
        `https://harixom-desarrollo.onrender.com/api/like/${id}`,
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
        `https://harixom-desarrollo.onrender.com/api/follow/${userId}`,
        {
          title: "¡Te han empezado a seguir!",
          status: "Medium",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(data);
      
      setFollows((prev) => ({ ...prev, [userId]: data.following }));
      setHideFollow((prev) => ({ ...prev, [userId]: data.following }));
      showToast("¡Ahora sigues a este usuario!", "success");
    } catch (err) {
      console.error(err);
      showToast("Error al seguir", "error");
    }
  };

  const addComment = async (id: number, text: string, for_user_id: number) => {
    if (!text.trim()) {
      showToast("El comentario no puede estar vacío", "error");
      return;
    }
    try {
      const { data } = await axios.post(
        `https://harixom-desarrollo.onrender.com/api/comment/${id}`,
        {
          title: "¡Te han enviado un comentario!",
          comment: text,
          for_user_id: for_user_id,
          status: "Low",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => ({
        ...prev,
        [id]: [
          ...(prev[id] || []),
          `${data.comment.user.name}: ${data.comment.comment} `,
        ],
      }));

      showToast("¡Comentario publicado!", "success");
    } catch (err) {
      console.error(err);
      showToast("Error al publicar el comentario", "error");
    }
  };

  return (
    <div className="bg-stone-950 min-h-screen py-10 px-3"
      style={{ fontFamily: "Monserrat" }}>
      <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-1 max-xl:grid-cols-2 max-lg:items-center max-xl:flex max-xl:flex-wrap max-xl:justify-around">
        {publications.slice(0, visibleCount).map((pub) => (
          <div
            key={pub.id}
            className="bg-[#151515] rounded-2xl overflow-hidden flex flex-col w-[340px] h-[460px] max-lg:w-full max-lg:h-full"
            onClick={() => openModal(pub)}
          >
            {/* Imagen */}
            <div
              className="relative w-full h-[340px] aspect-square flex items-center justify-center cursor-pointer "
              onClick={() => openModal(pub)} // Solo abrir el modal al hacer clic en la imagen
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
                  {pub.user_name || "ArtistUser"}
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
            <div className="flex flex-row justify-between items-center px-4 py-5 bg-[#151515]">
              <div className="flex flex-row gap-5 items-center">
                {/* Like */}
                <button
                  className={`opacity-80 flex flex-row items-center gap-1 ${likes[pub.id] ? "text-red-500" : "text-gray-300"
                    }`}
                  title="Like"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(pub.id);
                  }}
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
                    className={`opacity-80 flex items-center justify-center ${follows[pub.user_id] ? "text-green-500" : "text-gray-300"
                      }`}
                    title={follows[pub.user_id] ? "Siguiendo" : "Seguir"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollow(pub.user_id!);
                    }}
                  >
                    {follows[pub.user_id] ? (
                      // Check
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
                <span className="ml-10 text-gray-300 font-bold">
                  {pub.category}
                </span>
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
                    Comentarios
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
                      Cancelar
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
                      Publicar
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
      ) : <div className="flex space-x-1 items-baseline text-gray-400 text-sm text-center justify-center pb-5 pt-10"> ESPERANDO PUBLICACIONES
        <p className="animate-pulse [animation-delay:-0.8s] text-2xl pl-1">.</p>
        <p className="animate-pulse [animation-delay:-0.3s] text-2xl">.</p>
        <p className="animate-pulse text-2xl" >.</p>
      </div>}

      {/* Modal publicaciones en grande */}
      {selectedPublication && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 max-lg:h-screen ">
          <div className="bg-[#151515] rounded-lg p-6 shadow-lg w-[90vw] h-[90vh] overflow-aut0 flex max-lg:flex-col max-lg:w-3/4 max-lg:h-3/4 max-lg:mb-25 max-lg:items-center">
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
            <div className="w-1/3 flex flex-col-2 justify-between max-lg:justify-center max-lg:w-4/5 max-lg:flex-col max-lg:pt-10">
              <div>
                <h2 className="text-white text-3xl font-bold">
                  {selectedPublication.user_name || "Usuario desconocido"}
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  {formatDate(selectedPublication.created_at)}
                </p>
                <p className="text-gray-300 mt-10 text-2xl">
                  <FeedDescription pub={selectedPublication} currentUserId={currentUserId} />
                </p>
                <div className="mt-8 flex gap-5">
                  <Link
                    to="/Categories/$name"
                    params={{
                      name: selectedPublication.category || "General"
                    }}
                    className="px-4 py-2 bg-pink-500 text-white rounded-full text-xl hover:scale-105 transition-transform"
                  >
                    {selectedPublication.category || "Sin categoría"}
                  </Link>
                </div>
              </div>

              {/* Botón para cerrar */}
              <button
                className="absolute hidden max-lg:translate-y-3/1 min-lg:bottom-30 min-lg:translate-x-3/1 px-8 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 text-lg shadow-lg"
                onClick={closeModal}
              >
                Cerrar
              </button>
              <button
                className="absolute right-60 max-lg:translate-y-3/1 min-lg:bottom-155 min-lg:translate-x-3/1 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 text-lg shadow-lg"
                onClick={closeModal}
              >
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
