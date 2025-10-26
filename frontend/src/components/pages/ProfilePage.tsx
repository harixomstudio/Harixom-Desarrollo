import { Link, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { useToast } from "../ui/Toast";
import { useState, useEffect } from "react";
import WatermarkedImage from "../ui/WaterMarkedImage";

interface Message {
  id?: number;
  userId: number;
  user: string;
  profile_picture?: string;
  message: string;
}

interface ProfileProps {
  username: string;
  followers: { id: number; name: string; profile_picture?: string; isBlocked?: boolean; }[];
  followings: { id: number; name: string; profile_picture?: string }[];
  address: string;
  description: string;
  profilePicture?: string;
  bannerPicture?: string;
  isPremium?: boolean;
  tabs?: string[];
  cards: { id: number; description: string; image?: string }[];
  likes: any[];
  services: string;
  prices: string;
  terms: string;
  userId: number;
  buyMeACoffee?: string;
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

export default function Profile(props: ProfileProps) {
  const { showToast } = useToast();

  // Hooks para UI
  const [showFollowers, setShowFollowers] = useState(false);
  const [followersState, setFollowersState] = useState(
    props.followers.map(f => ({ ...f, isBlocked: false })) // inicializamos isBlocked en false
  );
  const [showFollowings, setShowFollowings] = useState(false);
  const [cards, setCards] = useState(props.cards || []);
  const [favorites, setFavorites] = useState(props.likes || []);
  const [, setFollowers] = useState(props.followers || []);
  const [, setFollowings] = useState(props.followings || []);
  const [activeTab, setActiveTab] = useState(0);
  const tabs = props.tabs || ["Home", "Commissions", "Wall", "Favorites"];
  const [deleteModalOpen, setDeleteModalOpen] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [services, setServices] = useState<string>(props.services ?? "");
  const [prices, setPrices] = useState<string>(props.prices ?? "");
  const [terms, setTerms] = useState<string>(props.terms ?? "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [LinkText, setLinkText] = useState<string>(props.buyMeACoffee ?? "");
  const [selectedPublication, setSelectedPublication] = useState<any>(null);
  const [loadingPublication, setLoadingPublication] = useState(false);
  const [currentUserId] = useState<number | null>(null);

  // Hooks para mensajes
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const [visibleCount, setVisibleCount] = useState(12);
  const [messageCount, setMessageCount] = useState(4);
  const [favoriteCount, setFavoriteCount] = useState(12);



  useEffect(() => { //Despliegue de un infinito, scroll aparece cargando y aumentan las publicaciones favoritas
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
        setFavoriteCount((prevCount) => prevCount + 12);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };


  }, [favoriteCount]);

  useEffect(() => { //Despliegue de un infinito, scroll aparece cargando y aumentan las publicaciones
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
        setVisibleCount((prevCount) => prevCount + 12);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };


  }, [visibleCount]);

  useEffect(() => { //Despliegue de un infinito, scroll aparece cargando y aumentan los mensajes
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY === document.documentElement.scrollHeight) {
        setMessageCount((prevCount) => prevCount + 4);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };


  }, [messageCount]);

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  axios.defaults.withCredentials = true;

  useEffect(() => {
    if (!token) return;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `https://harixom-desarrollo.onrender.com/api/profile/${props.userId}/messages`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const mapped = data.map((msg: any) => ({
          id: msg.id,
          userId: msg.from_user.id,
          user: msg.from_user.name,
          profile_picture: msg.from_user.profile_picture,
          message: msg.message,
        }));
        setMessages(mapped);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    const interval = setInterval(fetchMessages, 30000);

    return () => clearInterval(interval);
  }, [props.userId, token]);

  useEffect(() => setCards(props.cards || []), [props.cards]);
  useEffect(() => setFavorites(props.likes || []), [props.likes]);
  useEffect(() => setFollowers(props.followers || []), [props.followers]);
  useEffect(
    () => setFollowings(props.followings || []),
    [props.followings]
  );

  useEffect(() => setLinkText(props.buyMeACoffee || ""), [props.buyMeACoffee]);

  // Funciones
  const handleDeletePublication = async (id: number) => {
    try {
      await axios.delete(`https://harixom-desarrollo.onrender.com/api/publications/${id}`, {
        headers: {
          withCredentials: true,
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setCards((prev) => prev.filter((c) => c.id !== id));
      showToast("¡Publicación eliminada!", "success");
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
      showToast("No se pudo eliminar la publicación.", "error");
    } finally {
      setDeleteModalOpen(null);
    }
  };

  const handleToggleLike = async (postId: number) => {
    try {
      const token = localStorage.getItem("access_token");
      const { data } = await axios.post(
        `https://harixom-desarrollo.onrender.com/api/like/${postId}`,
        {},
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.liked) {
        setFavorites((prev) => [...prev, data.post]); // agrega si liked
      } else {
        setFavorites((prev) => prev.filter((f) => f.id !== postId)); // elimina si deslike
      }
      showToast(data.liked ? "Like agregado" : "Like eliminado", "success");
    } catch (err) {
      console.error(err);
      showToast("No se pudo actualizar el like", "error");
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        "https://harixom-desarrollo.onrender.com/api/user/profile",
        {
          services,
          prices,
          terms,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showToast("Commissions guardadas correctamente", "success");
      setEditing(false);
    } catch (error) {
      console.error(error);
      showToast("Error al guardar commissions", "error");
    }
  };

  const handleSendMessage = async () => {
    try {
      if (!token || !newMessage.trim()) return;
      const { data } = await axios.post(
        `https://harixom-desarrollo.onrender.com/api/profile/messages`,
        { to_user_id: props.userId, message: newMessage },
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      const msg = {
        id: data.data.id,
        userId: data.data.from_user.id,
        user: data.data.from_user.name,
        profile_picture: data.data.from_user.profile_picture,
        message: data.data.message,
      };
      setMessages((prev) => [msg, ...prev]);
      setNewMessage("");
      showToast("Mensaje enviado", "success");
    } catch (err) {
      console.error(err);
      showToast("No se pudo enviar el mensaje", "error");
    }
  };

  // Función para eliminar mensaje
  const handleDeleteMessage = async (id: number) => {
    try {
      await axios.delete(`https://harixom-desarrollo.onrender.com/api/profile/messages/${id}`, {
        withCredentials: true, headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showToast("Mensaje eliminado", "success");
    } catch (err) {
      console.error("Error al eliminar mensaje:", err);
      showToast("No se pudo eliminar el mensaje", "error");
    }
  };

  const handleSendCoffee = async () => {
    try {
      if (!LinkText.trim()) {
        showToast("Escribe un link antes de enviar", "error");
        return;
      }
      const { } = await axios.post(
        `https://harixom-desarrollo.onrender.com/api/user/update-coffee-link`,
        {
          buymeacoffee_link: LinkText
        },
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } },
      );

      showToast("link guardado con éxito", "success");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast("Error al enviar el link", "error");
    }
  };

  const openModal = async (publicationId: number) => {
    try {
      setLoadingPublication(true);

      const token = localStorage.getItem("access_token");
      const { data } = await axios.get(
        `https://harixom-desarrollo.onrender.com/api/publications/${publicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setSelectedPublication(data);
      setLoadingPublication(false);
    } catch (err) {
      console.error("Error fetching publication:", err);
      setLoadingPublication(false);
    }
  };

  //const closeModal = () => {
  //  setSelectedPublication(null);
  //};

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

  return (
    <section
      className="relative flex items-center justify-center bg-stone-950 min-h-screen"
      style={{ fontFamily: "Monserrat" }}
    >
      <div className="w-full flex flex-col">
        {/* Banner y Avatar */}
        <div className="relative mb-10">
          <div className="rounded-xl h-100 flex relative overflow-hidden w-full">
            <div className="flex relative w-full h-full items-center justify-center">
              <img
                src={props.bannerPicture}
                alt=""
                className="w-full h-full object-cover"
              />
              {props.bannerPicture ===
                "https://img.freepik.com/foto-gratis/fondo-textura-abstracta_1258-30553.jpg?semt=ais_incoming&w=740&q=80" && (
                  <h2 className="absolute max-lg:text-3xl max-xl:text-4xl duration-500 transform text-6xl font-berkshire text-pink-400">
                    Change banner
                  </h2>
                )}
            </div>


            <div className="absolute right-8 bottom-8 z-20">
              {/* Botón de editar perfil */}
              <Link to="/SetProfile">
                <div className="flex items-center gap-2 px-4 py-2 bg-pink-400 rounded-full hover:scale-105 transition duration-300 cursor-pointer">
                  <span className="text-black font-semibold text-base max-[19rem]:text-[0.6rem]">Edit Profile</span>
                  <img
                    src="/editar.png"
                    alt="Editar"
                    className="w-4 h-4"
                  />
                </div>
              </Link>
            </div>



            <div className="absolute left-5 bottom-2">
              <img
                src={
                  props.profilePicture ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="Avatar"
                className="w-42 h-42 max-lg:w-25 max-lg:h-25 rounded-full border-5 border-stone-950 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col pl-10 text-white mt-6 mb-10 max-[19rem]:pl-5">
          <div className="flex items-center mb-2">
            {/* Username */}
            <span className="text-3xl max-lg:text-2xl font-bold max-[19rem]:text-xl">{props.username}</span>
            {props.isPremium && (
              <img src="/premium.svg" alt="Insignia Premium" className="w-6 h-6 mx-2" />
            )}

            {/* Buy me a coffee button */}
            <button
              className="bg-[#96E2FF] hover:bg-[#62aecc] duration-500 text-black font-bold py-2 px-4 rounded-full ml-auto mr-8 max-[19rem]:text-[0.6rem]"
              onClick={() => setIsModalOpen(true)}>
              Buy me a coffee
            </button>
          </div>

          {/* Description */}
          <span className="text-gray-400 text-lg mb-6">{props.address}</span>

          {/* Followers & Followings  */}
          <div className="flex gap-20 max-lg:gap-5 max-lg:text-sm text-white font-semibold text-xl mb-2">
            <span
              className="cursor-pointer hover:text-pink-400 flex flex-col items-center duration-500"
              onClick={() => setShowFollowers(true)}
            >
              <span>Followers</span>
              <span className="text-gray-300 text-lg font-normal">
                {props.followers.length}
              </span>
            </span>
            <span
              className="cursor-pointer hover:text-pink-400 flex flex-col items-center duration-500"
              onClick={() => setShowFollowings(true)}
            >
              <span>Followings</span>
              <span className="text-gray-300 text-lg font-normal">
                {props.followings.length}
              </span>
            </span>
          </div>

          {/* Followers Modal */}
          {showFollowers && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-stone-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto shadow-lg">
                <h3 className="text-2xl text-pink-400 font-bold mb-6 text-center">Followers</h3>
                <ul>
                  {followersState.map((f, index) => (
                    <li
                      key={f.id}
                      className="flex items-center gap-4 py-3 border-b border-stone-700 cursor-pointer hover:bg-stone-700 rounded transition-all"
                      onClick={() => {
                        if (f.id === props.userId) {
                          navigate({ to: "/Profile" });
                        } else {
                          navigate({ to: "/ProfileGuest", search: { userId: f.id } });
                        }
                      }}
                    >
                      <img
                        src={
                          f.profile_picture ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        }
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {f.name}

                      <button
                        className={`ml-auto px-2 py-1 rounded text-white ${f.isBlocked ? "bg-green-500" : "bg-red-500"
                          }`}
                        onClick={async (e) => {
                          e.stopPropagation(); // evita navegar al perfil al hacer click
                          try {
                            if (f.isBlocked) {
                              // Desbloquear
                              await axios.delete(`https://harixom-desarrollo.onrender.com/api/unblock/${f.id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              showToast("Usuario desbloqueado", "success");
                            } else {
                              // Bloquear
                              await axios.post(`https://harixom-desarrollo.onrender.com/api/block/${f.id}`, {}, {
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              showToast("Usuario bloqueado", "success");
                            }

                            // Actualizar estado local
                            const newFollowers = [...followersState];
                            newFollowers[index].isBlocked = !f.isBlocked;
                            setFollowersState(newFollowers);
                          } catch (err) {
                            showToast("Error actualizando estado de usuario", "error");
                          }
                        }}
                      >
                        {f.isBlocked ? "Desbloquear" : "Bloquear"}
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  className="mt-6 w-full py-3 bg-pink-500 text-white font-semibold rounded hover:bg-pink-600 transition-colors"
                  onClick={() => setShowFollowers(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}


          {/* Followings Modal */}
          {showFollowings && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-stone-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
                <h3 className="text-2xl text-pink-400 font-bold mb-6 text-center">Followings</h3>
                <ul>
                  {props.followings.map((f) => (
                    <li
                      key={f.id}
                      className="flex items-center gap-4 py-3 border-b border-stone-700 cursor-pointer hover:bg-stone-700 rounded transition-all"
                      onClick={() => {
                        if (f.id === props.userId) {
                          navigate({ to: "/Profile" });
                        } else {
                          navigate({ to: "/ProfileGuest", search: { userId: f.id } });
                        }
                      }}
                    >
                      <img
                        src={
                          f.profile_picture ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        } className="w-12 h-12 rounded-full object-cover" />
                      {f.name}
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-6 w-full py-3 bg-pink-500 text-white font-semibold rounded hover:bg-pink-600 transition-colors"
                  onClick={() => setShowFollowings(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <p className="text-gray-300 text-sm my-3 ">
            {props.description}
          </p>


          {/* Modal de buy a coffee */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-stone-800 rounded-lg border-gray-700 p-6 shadow-lg w-96 border">
                <h2 className="text-white text-lg font-semibold mb-4">
                  Escribe tu link de <a href="https://studio.buymeacoffee.com/dashboard" className="text-pink-400 underline underline-offset-2 animate-pulse">Buy Me A Coffee</a>
                </h2>
                <textarea
                  value={LinkText}
                  onChange={(e) => {
                    let value = e.target.value.trim();
                    const base = "buymeacoffee.com/";
                    if (!value.startsWith(base)) {
                      value = base + value;
                    }
                    setLinkText(value)
                  }}
                  placeholder="Escribe tu link de Buy Me A Coffee..."
                  className="w-full bg-gray-900 text-white p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 border border-purple-500"
                  rows={2}
                />
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
                    onClick={() => {
                      setIsModalOpen(false);
                      setLinkText("");
                    }}
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsModalOpen(false)
                      handleSendCoffee();
                    }}>
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center w-full">
            {/* Link de buy a coffee */}
            <a href={`https://${LinkText}`} className={` underline underline-offset-2 text-pink-400 w-fit hover:scale-105 duration-500 max-[19rem]:text-[0.6rem]`}>{LinkText}</a>


          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-400 mb-8 px-4 max-lg:gap-2 max-md:gap-2 max-md:Items-center max-[19rem]:gap-1 ">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`pb-4 font-semibold text-xl px-5 max-lg:text-sm max-md:px-2 max-[19rem]:text-[0.6rem] max-[19rem]:px-1 ${activeTab === i
                ? "text-pink-400 border-b-2 border-pink-400"
                : "text-gray-200 hover:text-pink-400 duration-500"
                }`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="w-full flex flex-col py-10 px-6">
          {activeTab === 1 ? (
            /* Commissions tab */
            <>
              <div className="flex justify-end mb-6">
                <button
                  onClick={editing ? handleSaveChanges : () => setEditing(true)}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-full transition-all"
                >
                  {editing ? "Save Changes" : "Edit"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-stone-800 rounded-lg p-6 text-gray-200">
                  <h3 className="text-pink-400 font-bold text-lg mb-4">
                    Services
                  </h3>
                  {editing ? (
                    <textarea
                      value={services}
                      onChange={(e) => setServices(e.target.value)}
                      className="w-full bg-stone-900 text-sm text-gray-100 p-2 rounded resize-none h-40"
                    />
                  ) : (
                    <pre className="text-sm whitespace-pre-line">
                      {services}
                    </pre>
                  )}
                </div>

                <div className="bg-stone-800 rounded-lg p-6 text-gray-200">
                  <h3 className="text-pink-400 font-bold text-lg mb-4">
                    Price
                  </h3>
                  {editing ? (
                    <textarea
                      value={prices}
                      onChange={(e) => setPrices(e.target.value)}
                      className="w-full bg-stone-900 text-sm text-gray-100 p-2 rounded resize-none h-40"
                    />
                  ) : (
                    <pre className="text-sm whitespace-pre-line">{prices}</pre>
                  )}
                </div>

                <div className="bg-stone-800 rounded-lg p-6 text-gray-200">
                  <h3 className="text-pink-400 font-bold text-lg mb-4">
                    Terms and Conditions
                  </h3>
                  {editing ? (
                    <textarea
                      value={terms}
                      onChange={(e) => setTerms(e.target.value)}
                      className="w-full bg-stone-900 text-sm text-gray-100 p-2 rounded resize-none h-40"
                    />
                  ) : (
                    <pre className="text-sm whitespace-pre-line">{terms}</pre>
                  )}
                </div>
              </div>
            </>
          ) : activeTab === 2 ? (


            /* Messages tab */
            <div className="w-full max-w-4xl mx-auto">
              <div className="mb-6">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write a message..."
                  className="w-full bg-stone-800 text-gray-200 p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSendMessage}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-full transition-all"
                  >
                    Send
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {messages.length ? (
                  messages.slice(0, messageCount).map((msg) => (
                    <div
                      key={msg.id}
                      className="relative bg-stone-800 p-4 rounded-lg text-gray-200 flex items-start gap-2"
                    >
                      <img
                        src={
                          msg.profile_picture ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        }
                        className="w-10 h-10 rounded-full cursor-pointer"
                        onClick={() => {
                          if (msg.userId && msg.userId === props.userId) {
                            navigate({ to: "/ProfileGuest", search: { userId: msg.userId } });
                          } else {
                            navigate({ to: "/Profile" });
                          }
                        }}
                      />
                      <div>
                        <span
                          className="text-sm font-semibold text-pink-400 cursor-pointer"
                          onClick={() => {
                            if (msg.userId && msg.userId === props.userId) {
                              navigate({ to: "/Profile" });
                            } else {
                              navigate({
                                to: "/ProfileGuest",
                                search: { userId: msg.userId },
                              });
                            }
                          }}
                        >
                          {msg.user}
                        </span>
                        <p className="text-sm mt-1">{msg.message}</p>
                      </div>
                      <button
                        className="absolute top-6 right-3 bg-pink-400 hover:bg-pink-500 text-white text-xs px-2 py-1 rounded"
                        onClick={() => handleDeleteMessage(msg.id!)}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm text-center">No messages yet.</p>
                )}
              </div>
              {messageCount < messages.length ? ( // esto es el loading se activa al scrollear
                <div className="flex justify-center pt-10 pb-15">
                  <div className="flex space-x-3">
                    <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.6s]"></div>
                    <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              ) : <div className={`text-gray-400 text-sm text-center pb-5 pt-10 ${messages.length === 0 ? 'hidden' : ''}`}> NO MORE MESSAGES</div>}

            </div>
          ) : activeTab === 3 ? (
            /* Favorites tab */
            <div className="w-full max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {favorites.length ? (
                  favorites.slice(0, favoriteCount).map((like) => (
                    <div
                      key={like.id}
                      className="relative bg-stone-800 rounded-lg p-4 flex flex-col items-center"
                    >
                      <button
                        onClick={() => handleToggleLike(like.id)}
                        className="absolute top-2 right-2 bg-pink-400 hover:bg-pink-500 text-white text-xs px-2 py-1 rounded"
                      >
                        ✕
                      </button>
                      {like.image ? (
                        <img
                          src={like.image}
                          alt={`Post ${like.id}`}
                          className="w-24 h-24 rounded-lg object-cover mb-2"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-600 rounded-lg flex items-center justify-center text-gray-300 mb-2">
                          No Image
                        </div>
                      )}
                      <p className="text-gray-200 text-sm text-center">
                        {like.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm col-span-4 text-center">
                    No hay likes aún.
                  </p>
                )}
              </div>
              {favoriteCount < favorites.length ? ( // esto es el loading se activa al scrollear
                <div className="flex justify-center pt-10 pb-15">
                  <div className="flex space-x-3">
                    <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.6s]"></div>
                    <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              ) : <div className={`text-gray-400 text-sm text-center pb-5 pt-10 ${favorites.length === 0 ? 'hidden' : ''}`}> NO MORE FAVORITES</div>}
            </div>
          ) : (
            /* Home tab - Posts */
            <div>
              <div className="w-full columns-4 max-lg:columns-2 max-md:columns-1">
                {cards.length ? (
                  cards.slice(0, visibleCount).map((card) => (
                    
                    <div
                      key={card.id}
                      className="mb-6 rounded-2xl bg-stone-800 overflow-hidden relative"
                    >
                      <button
                        onClick={() => setDeleteModalOpen(card.id)}
                        className="absolute top-2 right-2 bg-pink-500 hover:bg-pink-600 duration-500 text-white text-xs px-2 py-1 rounded z-10"
                      >
                        ✕
                      </button>

                      {deleteModalOpen === card.id && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                          <div className="bg-stone-800 rounded-lg p-6 shadow-lg w-96">
                            <h2 className="text-white text-lg font-semibold mb-4">
                              ¿Estás seguro de que deseas eliminar esta
                              publicación?
                            </h2>
                            <div className="flex justify-end gap-4 mt-4">
                              <button
                                className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
                                onClick={() => setDeleteModalOpen(null)}
                              >
                                Cancelar
                              </button>
                              <button
                                className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white"
                                onClick={() => handleDeletePublication(card.id)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {cards.slice(0, visibleCount).map((card) => (
                        <div key={card.id} className="mb-6 rounded-2xl bg-stone-800 overflow-hidden relative">
                          <img
                            src={card.image}
                            alt={card.description}
                            className="w-full h-auto block"
                            onClick={() => openModal(card.id)} // <-- aquí abrimos el modal con id
                          />
                        </div>
                      ))}
                      <p className="text-xs text-gray-200 text-center px-2 py-2">
                        {card.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm text-center col-span-3">
                    No hay posts aún.
                  </p>
                )}
              </div>
              {visibleCount < cards.length ? ( // esto es el loading se activa al scrollear
                <div className="flex justify-center pt-10 pb-15">
                  <div className="flex space-x-3">
                    <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.6s]"></div>
                    <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              ) : <div className={`text-gray-400 text-sm text-center pb-5 pt-10 ${cards.length === 0 ? 'hidden' : ''}`}> NO MORE POSTS</div>}
            </div>
          )}
        </div>
      </div>

      {/* Botón flotante */}
      <Link
        to="/CreatePublication"
        className="fixed bottom-6 right-8 bg-pink-500 hover:bg-pink-600 text-white text-lg font-bold py-5 px-7 rounded-full shadow-lg transition-all duration-300"
      >
        +
      </Link>
      {selectedPublication && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 max-lg:h-screen">
          {loadingPublication ? (
            <div className="text-white">Cargando...</div>
          ) : (
            <div className="bg-[#151515] rounded-lg p-6 shadow-lg w-[90vw] h-[90vh] overflow-auto flex max-lg:flex-col max-lg:w-3/4 max-lg:h-3/4 max-lg:mb-6 max-lg:items-center relative">
              {/* Imagen a la izquierda */}
              <div className="w-2/3 h-full flex items-center justify-center max-lg:h-1/2 max-lg:w-full">
                {selectedPublication.image ? (
                  <WatermarkedImage
                    src={selectedPublication.image}
                    alt={selectedPublication.description}
                    className="w-full h-full object-cover rounded-lg max-lg:w-4/5"
                    watermarkText={`Propiedad de ${selectedPublication.user_name || "Usuario desconocido"}`}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-500 flex items-center justify-center text-gray-300 text-xs">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* Información a la derecha */}
              <div className="w-1/3 flex flex-col justify-between max-lg:justify-center max-lg:w-4/5 max-lg:flex-col max-lg:pt-6 relative mx-4">
                <div>
                  <h2 className="text-white text-3xl font-bold">
                    {selectedPublication.user_name || "Usuario desconocido"}
                  </h2>
                  <p className="text-gray-400 text-sm mt-2">
                    {formatDate(selectedPublication.created_at)}
                  </p>
                  <p className="text-gray-300 mt-4 text-lg">
                    <FeedDescription pub={selectedPublication} currentUserId={currentUserId} />
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Link
                      to="/Categories/$name"
                      params={{ name: selectedPublication.category || "General" }}
                      className="px-4 py-2 bg-pink-500 text-white rounded-full text-sm hover:scale-105 transition-transform"
                    >
                      {selectedPublication.category || "Sin categoría"}
                    </Link>
                  </div>
                </div>

                {/* Botones de cierre */}
                <button
                  className="absolute top-0 right-0 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 text-lg shadow-lg max-lg:right-6 max-lg:top-2"
                  onClick={() => setSelectedPublication(null)}
                >
                  X
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section >
  );
}
