import { Link, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../ui/Toast";
import WatermarkedImage from "../ui/WaterMarkedImage";
import FeedDescription from "../FeedDescription";

interface Message {
  id?: number;
  userId: number;
  user: string;
  profile_picture?: string;
  message: string;
}

interface ProfileGuestProps {
  username: string;
  isPremium?: boolean;
  followers: { id: number; name: string; profile_picture?: string }[];
  followings: { id: number; name: string; profile_picture?: string }[];
  address: string;
  description: string;
  profilePicture?: string;
  bannerPicture?: string;
  tabs?: string[];
  cards: { id: number; description: string; image?: string }[];
  likes: any[];
  isFollowing?: boolean;
  userId: number;
  buyMeACoffee?: string;
  commissions_enabled?: boolean;
}

export default function ProfileGuestPage(props: ProfileGuestProps) {
  const { showToast } = useToast();
  const authUser = JSON.parse(localStorage.getItem("auth_user") || "{}");
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  // UI States
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);
  const [followers, setFollowers] = useState(props.followers || []);
  const [followings, setFollowings] = useState(props.followings || []);
  const [cards,] = useState(props.cards || []);
  const [favorites, setFavorites] = useState(props.likes || []);
  const [activeTab, setActiveTab] = useState(0);
  const [isFollowing, setIsFollowing] = React.useState(false);
  const tabs = props.tabs || ["Home", "Commissions", "Wall", "Favorites"];
  const [] = useState<{ [key: number]: string[] }>({});
  const [selectedPublication, setSelectedPublication] = useState<any>(null);
  const [loadingPublication, setLoadingPublication] = useState(false);

  // Commissions

  const [services, setServices] = useState("");
  const [prices, setPrices] = useState("");
  const [terms, setTerms] = useState("");
  const [commissionsEnabled, setCommissionsEnabled] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [messageCount, setMessageCount] = useState(4);
  const [favoriteCount, setFavoriteCount] = useState(12);


  // Modal de comisión
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commissionText, setCommissionText] = useState("");
  const [dateDoIt, setDateDoIt] = useState("");
  const [howDoIt, setHowDoIt] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => { //Despliegue de un infinito, scroll aparece cargando y aumentan las publicaciones
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


  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"; // Desactiva el scroll
    } else {
      document.body.style.overflow = ""; // Lo reactiva
    }

  }, [isModalOpen]);

  // Messages
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);


  const [, setButtonPosition] = useState({ top: 450, left: 1000 });
  (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setButtonPosition({
      top: rect.top + window.scrollY + rect.height + 200,
      left: rect.left + window.scrollX,
    });
    setIsModalOpen(true);
  };



  // Fetch de perfil guest, comisiones y mensajes
  useEffect(() => {
    if (!token) return;

    const fetchGuestData = async () => {
      try {
        // Datos del perfil
        const profileRes = await axios.get(
          `https://harixom-desarrollo.onrender.com/api/users/${props.userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = profileRes.data;
        setFollowers(data.followers || []);
        setFollowings(data.followings || []);
        setServices(data.user.services || "");
        setPrices(data.user.prices || "");
        setTerms(data.user.terms || "");
        setCommissionsEnabled(!!data.user.commissions_enabled);

        // Mensajes
        const messagesRes = await axios.get(
          `https://harixom-desarrollo.onrender.com/api/profile/${props.userId}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const mapped = messagesRes.data.map((msg: any) => ({
          id: msg.id,
          userId: msg.from_user.id,
          user: msg.from_user.name,
          profile_picture: msg.from_user.profile_picture,
          message: msg.message,
        }));
        mapped.sort((a: any, b: any) => (b.id || 0) - (a.id || 0));
        setMessages(mapped);
      } catch (err) {
        console.error("Error fetching guest profile:", err);
      }
    };

    fetchGuestData();

    const interval = setInterval(async () => {
      try {
        const messagesRes = await axios.get(
          `https://harixom-desarrollo.onrender.com/api/profile/${props.userId}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const mapped = messagesRes.data.map((msg: any) => ({
          id: msg.id,
          userId: msg.from_user.id,
          user: msg.from_user.name,
          profile_picture: msg.from_user.profile_picture,
          message: msg.message,
        }));
        mapped.sort((a: any, b: any) => (b.id || 0) - (a.id || 0));
        setMessages((prev) => {
          if (prev.length !== mapped.length) return mapped;
          return prev;
        });
      } catch (err) {
        console.error("Error fetching guest messages:", err);
      }
    }, 30000);

    // Cleanup
    return () => clearInterval(interval);
  }, [props.userId, token]);



  const handleSendCommission = async (toUserId: number) => {
    try {
      if (!commissionText.trim()) {
        showToast("Escribe una comisión antes de enviar", "error");
        return;
      }
      const { } = await axios.post(
        `https://harixom-desarrollo.onrender.com/api/user/commisions`,
        {
          to_user_id: toUserId,
          message: commissionText,
          howDoIt: howDoIt,
          details: details,
          dateDoIt: dateDoIt,
          date: new Date().toISOString().split("T")[0],
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      showToast("Comisión enviada con éxito", "success");
      setIsModalOpen(false);
      setCommissionText("");
    } catch (err) {
      console.error(err);
      showToast("Error al enviar la comisión", "error");
    }
  };

  // Enviar mensaje
  const handleSendMessage = async () => {
    try {
      if (!token || !newMessage.trim()) return;
      const { data } = await axios.post(
        `https://harixom-desarrollo.onrender.com/api/profile/messages`,
        {
          to_user_id: props.userId,
          title: "¡Te han escrito en tu muro!",
          message: newMessage,
          status: "Medium",
        },
        { headers: { Authorization: `Bearer ${token}` } }
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
  React.useEffect(() => {
    const fetchGuestProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `https://harixom-desarrollo.onrender.com/api/users/${props.userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data;
        setFollowers(data.followers || []);
        setIsFollowing(!!data.isFollowing);
      } catch (error) {
        console.error("Error cargando perfil ajeno:", error);
      }
    };

    fetchGuestProfile();
  }, [props.userId]);
  React.useEffect(() => {
    setFavorites(props.likes || []);
  }, [props.likes]);
  React.useEffect(() => {
    setFollowers(props.followers || []);
  }, [props.followers]);
  React.useEffect(() => {
    setIsFollowing(!!props.isFollowing);
  }, []);

  const handleToggleFollow = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const url = `https://harixom-desarrollo.onrender.com/api/follow/${props.userId}`;

      const response = await axios.post(url, {
        title: "¡Te han empezado a seguir!",
        status: "Medium",
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newStatus = response.data.following;
      setIsFollowing(newStatus);

      setFollowers(prev => {
        if (newStatus) {
          return [...prev, { id: authUser.id, name: authUser.name, profile_picture: authUser.profile_picture }];
        } else {
          return prev.filter(f => f.id !== authUser.id);
        }
      });

      showToast(
        newStatus ? "Ahora sigues a este usuario" : "Dejaste de seguir a este usuario",
        "success"
      );

    } catch (error) {
      console.error(error);
      showToast("Error al actualizar el seguimiento", "error");
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
    <section className="relative flex items-center justify-center bg-stone-950 min-h-screen"
      style={{ fontFamily: "Montserrat" }}>
      <div className="w-full flex flex-col">
        {/* Banner y Avatar */}
        <div className="relative mb-10">
          <div className="rounded-xl h-100 flex relative overflow-hidden w-full">
            <img
              src={props.bannerPicture}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute left-5 bottom-2">
              <img
                src={
                  props.profilePicture ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="Avatar"
                className="w-42 h-42 rounded-full border-5 border-stone-950 object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col px-10 text-white mt-6 mb-10 w-full">

          {/* Username */}
          <div className="flex items-center w-full gap-15 max-lg:gap-5 max-[19rem]:gap-2 ">
            <span className="text-3xl max-lg:text-2xl font-bold mb-2 max-[19rem]:text-xl flex items-center gap-2">
              {props.username}
              {props.isPremium && (
                <img src="/premium.svg" alt="Insignia Premium" className="w-6 h-6" />
              )}
            </span>
            <button
              onClick={handleToggleFollow}
              className={`px-4 py-2  max-[19rem]:text-sm rounded-full text-white font-semibold transition-all ${isFollowing ? "bg-gray-600 hover:bg-gray-700" : "bg-pink-500 hover:bg-pink-600"
                }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>

            {/* Botón flotante de comisiones */}
            {commissionsEnabled && (
              <button
                className="max-lg:text-xl py-3 px-6 max-[19rem]:px-4 max-[19rem]:py-2 bg-green-400 text-2xl font-bold rounded-full hover:scale-125 transition z-10 text-black justify-start items-end text-center ml-auto"
                style={{ fontFamily: "Monserrat" }}
                onClick={() => setIsModalOpen(true)}
              >
                $
              </button>
            )}
          </div>

          {/* Description */}
          <span className="text-gray-400 text-lg mb-6 max-lg:text-sm">{props.address}</span>

          {/* Followers & Followings  */}
          <div className="flex gap-20 max-lg:gap-5 text-white font-semibold text-xl mb-2 max-lg:text-sm">
            <span
              className="cursor-pointer hover:text-pink-400 flex flex-col items-center"
              onClick={() => setShowFollowers(true)}
            >
              <span>Followers</span>
              <span className="text-gray-300 text-lg font-normal">
                {followers.length}
              </span>
            </span>
            <span
              className="cursor-pointer hover:text-pink-400 flex flex-col items-center"
              onClick={() => setShowFollowings(true)}
            >
              <span>Followings</span>
              <span className="text-gray-300 text-lg font-normal">
                {followings.length}
              </span>
            </span>
          </div>

          {/* Followers Modal */}
          {showFollowers && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-stone-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
                <h3 className="text-2xl text-pink-400 font-bold mb-6 text-center">Followers</h3>
                <ul>
                  {props.followers.map((f) => (
                    <li

                      key={f.id}
                      className="flex items-center gap-4 py-3 border-b border-stone-700 cursor-pointer hover:bg-stone-700 rounded transition-all"
                      onClick={() => {
                        setShowFollowers(false); // Cerrar el modal de Followers

                        if (f.id === authUser.id) {
                          navigate({ to: "/Profile" });
                        } else {
                          window.location.search = "userId=" + f.id;
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
                  ))
                  }
                </ul>
                <button
                  className="mt-6 w-full py-3 bg-pink-500 text-white font-semibold rounded hover:bg-pink-600 transition-colors"
                  onClick={() =>
                    setShowFollowers(false)

                  }
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
                        setShowFollowings(false); // Cerrar el modal de Followings
                        if (f.id === authUser.id) {
                          navigate({ to: "/Profile" });
                        } else {
                          window.location.search = "userId=" + f.id;
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

          <p className="text-gray-300 text-sm mt-2 py-10">
            {props.description}
          </p>

          <a href={`https://${props.buyMeACoffee}`} className={` underline underline-offset-2 text-pink-400 w-fit hover:scale-105 duration-500`}>{props.buyMeACoffee}</a>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-400 mb-8 px-4 max-lg:gap-2 max-md:gap-2 max-md:Items-center max-[19rem]:gap-1 ">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`pb-4 font-semibold text-xl px-5 max-lg:text-sm max-md:px-2 max-[19rem]:text-[0.6rem] max-[19rem]:px-1  ${activeTab === i
                ? "text-pink-400 border-b-2 border-pink-400"
                : "text-gray-200  hover:text-pink-400 duration-500"
                }`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="w-full flex flex-col py-10 px-6 ">
          {activeTab === 1 ? (
            // Commissions
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-stone-800 rounded-lg p-6 text-gray-200">
                <h3 className="text-pink-400 font-bold text-lg mb-4">
                  Services
                </h3>
                <pre className="text-sm whitespace-pre-line">{services}</pre>
              </div>
              <div className="bg-stone-800 rounded-lg p-6 text-gray-200">
                <h3 className="text-pink-400 font-bold text-lg mb-4">Prices</h3>
                <pre className="text-sm whitespace-pre-line">{prices}</pre>
              </div>
              <div className="bg-stone-800 rounded-lg p-6 text-gray-200">
                <h3 className="text-pink-400 font-bold text-lg mb-4">
                  Terms and Conditions
                </h3>
                <pre className="text-sm whitespace-pre-line">{terms}</pre>
              </div>
            </div>
          ) : activeTab === 2 ? (
            // Feed / Messages
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
                          className="text-sm font-semibold text-pink-400 cursor-pointer hover:text-pink-500"
                          onClick={() => {
                            if (msg.userId && msg.userId === props.userId) {

                              navigate({
                                to: "/ProfileGuest",
                                search: { userId: msg.userId },
                              });
                            } else {
                              navigate({ to: "/Profile" });
                            }
                          }}
                        >
                          {msg.user}
                        </span>
                        <p className="text-sm mt-1">{msg.message}</p>
                      </div>
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
                    No favorites yet.
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
            // Home / Posts
            <div>
              <div className="w-full columns-4 max-lg:columns-2 max-md:columns-1">
                {cards.length ? (
                  cards.slice(0, visibleCount).map((card) => (
                    <div
                      key={card.id}
                      className="mb-6 rounded-2xl bg-stone-800 overflow-hidden relative cursor-pointer"
                    >
                      {card.image ? (
                        <img
                          src={card.image}
                          alt={`Card ${card.id}`}
                          className="w-full h-auto block"
                          onClick={() => openModal(card.id)}
                        />
                      ) : (
                        <div className="w-full bg-gray-600 flex items-center justify-center text-gray-300 text-xs h-40">
                          No Image
                        </div>
                      )}
                      <div className="px-2 py-2 text-gray-200 text-xs text-center">
                        <FeedDescription pub={card} currentUserId={authUser.id} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm text-center">
                    no post yet.
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
        {selectedPublication && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 max-lg:h-screen">
            {loadingPublication ? (
              <div className="text-white">Loading...</div>
            ) : (
              <div className="bg-[#151515] rounded-lg p-6 shadow-lg w-[90vw] h-[90vh] overflow-auto flex max-lg:flex-col max-lg:w-3/4 max-lg:h-3/4 max-lg:mb-6 max-lg:items-center relative">
                {/* Imagen */}
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
                      No image
                    </div>
                  )}
                </div>

                {/* Información */}
                <div className="w-1/3 flex flex-col justify-between max-lg:justify-center max-lg:w-4/5 max-lg:flex-col max-lg:pt-6 relative mx-4">
                  <div>
                    <h2 className="text-white text-3xl font-bold">
                      {selectedPublication.user_name || "Usuario desconocido"}
                    </h2>
                    <p className="text-gray-400 text-sm mt-2">
                      {formatDate(selectedPublication.created_at)}
                    </p>
                    <p className="text-gray-300 mt-4 text-lg">
                      <FeedDescription pub={selectedPublication} currentUserId={authUser.id} />
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

                  {/* Botón de cierre */}
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
        {/* Modal de comisión */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-stone-800 rounded-lg border-gray-700 p-6 shadow-lg w-96 border">
              <h2 className="text-pink-400 text-lg font-semibold mb-4">
                Write your commission
              </h2>
              <textarea
                value={commissionText}
                onChange={(e) => setCommissionText(e.target.value)}
                placeholder="Write your commission..."
                className="w-full bg-gray-900 text-white p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 border border-purple-500"
                rows={2}
              />

              <textarea
                value={howDoIt}
                onChange={(e) => setHowDoIt(e.target.value)}
                placeholder="¿How to do it?"
                className="w-full bg-gray-900 text-white p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 border border-purple-500"
                rows={2}
              />
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Details..."
                className="w-full bg-gray-900 text-white p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 border border-purple-500"
                rows={2}
              />
              <input
                type="date"
                value={dateDoIt}
                onChange={(e) => setDateDoIt(e.target.value)}
                className="w-full bg-gray-900 text-white  p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 border border-purple-500"
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendCommission(props.userId);
                    setIsModalOpen(false)
                    setCommissionText("");
                    setHowDoIt("");
                    setDetails("");
                    setDateDoIt("");
                  }}>
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section >
  );
}
