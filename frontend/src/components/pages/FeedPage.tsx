import { useState } from "react";
import { useToast } from "../ui/Toast";

interface Publication {
  id: number;
  description: string;
  image?: string;
  user_name?: string;
  user_profile_picture?: string; // URL de la foto del usuario
}

interface FeedPageProps {
  publications: Publication[];
}

export default function FeedPage({ publications }: FeedPageProps) {
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState<number | null>(null); // Controla qué publicación tiene el modal abierto
  const [currentComment, setCurrentComment] = useState(""); // Texto del comentario
  const [comments, setComments] = useState<{ [key: number]: string[] }>({}); // Comentarios por publicación
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({});
  const [follows, setFollows] = useState<{ [key: number]: boolean }>({});

  const toggleLike = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/like/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setLikes((prev) => ({ ...prev, [id]: data.liked }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFollow = async (userId: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/follow/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setFollows((prev) => ({ ...prev, [userId]: data.following }));
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (id: number, text: string) => {
    if (!text.trim()) {
      showToast("El comentario no puede estar vacío", "error");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/api/comment/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ comment: text }),
      });
      const data = await res.json();

      setComments((prev) => ({
        ...prev,
        [id]: [...(prev[id] || []), `${data.comment.user.name}: ${data.comment.comment}`],
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
              <div className="absolute bottom-3 right-3 flex flex-col items-end gap-2 bg-stone-950 p-2 rounded-2xl ">
                {/* Follow */}
                <button
                  className="relative flex items-center justify-center text-white opacity-80 w-6 h-6 hover:scale-115"
                  title={follows[pub.id] ? "Siguiendo" : "Seguir"}
                  onClick={() => toggleFollow(pub.id!)}
                  onClickCapture={() => setFollows(pub.id ? { ...follows, [pub.id]: !follows[pub.id] } : { ...follows, [pub.id]: true })}
                >
                  {pub.user_profile_picture && (
                    <img
                      src={pub.user_profile_picture}
                      alt={pub.user_name}
                      className="w-6 h-6 rounded-full border-2 border-black transition-all duration-300"
                    />
                  )}
                  {!follows[pub.id] && (
                    <span className="absolute inset-0 flex items-center justify-center font-bold text-white">
                      +
                    </span>
                  )}
                </button>

                {/* Like */}
                <button
                  className="text-white opacity-80 hover:scale-110" title="Like" onClick={() => toggleLike(pub.id)} onClickCapture={() => setLikes(pub.id ? { ...likes, [pub.id]: !likes[pub.id] } : { ...likes, [pub.id]: true })} >
                  {likes[pub.id] ? (

                    <svg width="24" height="24" fill="red" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 21s-1-.5-2-1.5S5 14 5 10.5 8 5 12 8s7-2 7 2.5-5 9-5 9-1 1-2 1z" />
                    </svg>

                  ) : (

                    <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 21s-1-.5-2-1.5S5 14 5 10.5 8 5 12 8s7-2 7 2.5-5 9-5 9-1 1-2 1z" />
                    </svg>
                  )}

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
                  <h2 className="text-white text-lg font-semibold mb-4">Escribe tu comentario:</h2>
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