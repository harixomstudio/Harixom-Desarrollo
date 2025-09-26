import React from "react";
import axios from "axios";
import { useToast } from "../ui/Toast";

interface ProfileGuestProps {
  username: string;
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
}

export default function ProfileGuestPage(props: ProfileGuestProps) {
  const { showToast } = useToast();

  const authUser = JSON.parse(localStorage.getItem("auth_user") || "{}");


  const [showFollowers, setShowFollowers] = React.useState(false);
  const [showFollowings, setShowFollowings] = React.useState(false);
  const [followers, setFollowers] = React.useState(props.followers || []);
  const [cards] = React.useState(props.cards || []);
  const [activeTab, setActiveTab] = React.useState(0);
  const tabs = props.tabs || ["Home", "Commissions", "Feed", "Favorites"];
  const [favorites, setFavorites] = React.useState(props.likes || []);
  const [isFollowing, setIsFollowing] = React.useState(false);

  const [services, setServices] = React.useState(
    "Fnasarts\nSibek\nMecha\nMega\nCore"
  );
  const [prices, setPrices] = React.useState(
    "Chibi: $10\nHalf body: $15\nFull body: $25"
  );
  const [terms, setTerms] = React.useState(
    "El pago completo se hace primero.\nUna vez realizado el dibujo se empezará.\nNo se aceptan reembolsos."
  );

  const [newComment, setNewComment] = React.useState("");
  const [comments, setComments] = React.useState([
    {
      user: "usernameanon",
      message:
        "I have no idea how to bookmark, click circle to something idk. Right...",
    },
  ]);

  React.useEffect(() => {
    const fetchGuestProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`http://127.0.0.1:8000/api/users/${props.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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
    setIsFollowing(props.isFollowing || false);
  }, [props.isFollowing]);

  const handleToggleFollow = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const url = `http://127.0.0.1:8000/api/follow/${props.userId}`;

      const response = await axios.post(url, {}, {
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

  return (
    <section className="relative flex items-center justify-center bg-stone-950 min-h-screen">
      <div className="w-full flex flex-col">
        {/* Banner y Avatar */}
        <div className="relative mb-10">
          <div className="rounded-xl h-100 flex relative overflow-hidden w-full">
            <div className="flex relative w-full h-full items-center justify-center">
              <img src={props.bannerPicture} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute left-5 bottom-2">
              <img
                src={props.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                alt="Avatar"
                className="w-42 h-42 rounded-full border-5 border-stone-950 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="pl-10 mt-2 mb-6">
          <div className="flex gap-10 items-center text-white font-semibold text-2xl">
            <span>{props.username}</span>
            <span>Followers</span>
            <span>Followings</span>
            <button
              onClick={handleToggleFollow}
              className={`px-4 py-2 rounded-full text-white font-semibold transition-all ${isFollowing ? "bg-gray-600 hover:bg-gray-700" : "bg-pink-500 hover:bg-pink-600"
                }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>

          <div className="flex gap-35 text-gray-400 text-lg mb-1">
            <span>{props.address}</span>
            <span className="cursor-pointer hover:text-pink-400" onClick={() => setShowFollowers(true)}>
              {followers.length}
            </span>
            <span className="cursor-pointer hover:text-pink-400" onClick={() => setShowFollowings(true)}>
              {props.followings.length}
            </span>
          </div>

          {/* Followers Modal */}
          {showFollowers && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-stone-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
                <h3 className="text-pink-400 font-bold mb-4">Followers</h3>
                <ul>
                  {followers.map((f) => (
                    <li key={f.id} className="text-gray-200 mb-2 flex items-center gap-2">
                      <img src={f.profile_picture} className="w-6 h-6 rounded-full" />
                      {f.name}
                    </li>
                  ))}
                </ul>
                <button className="mt-4 px-4 py-2 bg-pink-500 text-white rounded" onClick={() => setShowFollowers(false)}>
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Followings Modal */}
          {showFollowings && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-stone-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
                <h3 className="text-pink-400 font-bold mb-4">Followings</h3>
                <ul>
                  {props.followings.map((f) => (
                    <li key={f.id} className="text-gray-200 mb-2 flex items-center gap-2">
                      <img src={f.profile_picture} className="w-6 h-6 rounded-full" />
                      {f.name}
                    </li>
                  ))}
                </ul>
                <button className="mt-4 px-4 py-2 bg-pink-500 text-white rounded" onClick={() => setShowFollowings(false)}>
                  Close
                </button>
              </div>
            </div>
          )}

          <p className="text-gray-300 text-sm mt-2 py-10">{props.description}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-400 mb-8 px-4">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`pb-4 font-semibold text-xl px-5 ${activeTab === i ? "text-pink-400 border-b-2 border-pink-400" : "text-gray-200"}`}
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

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-stone-800 rounded-lg p-6 text-gray-200">
                  <h3 className="text-pink-400 font-bold text-lg mb-4">
                    Services
                  </h3>

                  <textarea
                    value={services}
                    onChange={(e) => setServices(e.target.value)}
                    className="w-full bg-stone-900 text-sm text-gray-100 p-2 rounded resize-none h-40"
                  />
                  <p className="w-full bg-stone-900 text-sm text-gray-100 p-2 rounded resize-none h-40">
                    {services}
                  </p>
                </div>

                <div className="bg-stone-800 rounded-lg p-6 text-gray-200">
                  <h3 className="text-pink-400 font-bold text-lg mb-4">Price</h3>

                  <textarea
                    value={prices}
                    onChange={(e) => setPrices(e.target.value)}
                    className="w-full bg-stone-900 text-sm text-gray-100 p-2 rounded resize-none h-40"
                  />
                  <p className="w-full bg-stone-900 text-sm text-gray-100 p-2 rounded resize-none h-40">
                    {prices}
                  </p>
                </div>

                <div className="bg-stone-800 rounded-lg p-6 text-gray-200">
                  <h3 className="text-pink-400 font-bold text-lg mb-4">
                    Terms and Conditions
                  </h3>

                  <textarea
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    className="w-full bg-stone-900 text-sm text-gray-100 p-2 rounded resize-none h-40"
                  />
                  <p className="w-full bg-stone-900 text-sm text-gray-100 p-2 rounded resize-none h-40">
                    {terms}
                  </p>
                </div>
              </div>
            </>
          ) : activeTab === 2 ? (
            /* Feed tab */
            <div className="w-full max-w-4xl mx-auto">
              <div className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write message..."
                  className="w-full bg-stone-800 text-gray-200 p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      if (newComment.trim()) {
                        setComments([
                          { user: props.username, message: newComment },
                          ...comments,
                        ]);
                        setNewComment("");
                      }
                    }}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-full transition-all"
                  >
                    Publish
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {comments.map((comment, i) => (
                  <div
                    key={i}
                    className="bg-stone-800 p-4 rounded-lg text-gray-200"
                  >
                    <p className="text-sm font-semibold text-pink-400">
                      {comment.user}
                    </p>
                    <p className="text-sm mt-1">{comment.message}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 3 ? (
            /* Favorites tab */
            <div className="w-full max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {favorites.length ? (
                  favorites.map((like: any) => (
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
                      <p className="text-gray-200 text-sm text-center">{like.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm col-span-4 text-center">
                    No hay likes aún.
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Home tab - Posts */
            <div className="w-full columns-4 max-lg:columns-2 max-md:columns-1">
              {cards.length ? (
                cards.map((card) => (
                  <div
                    key={card.id}
                    className="mb-6 rounded-2xl bg-stone-800 overflow-hidden relative"
                  >
                    {card.image ? (
                      <img
                        src={card.image}
                        alt={`Card ${card.id}`}
                        className="w-full h-auto block"
                      />
                    ) : (
                      <div className="w-full bg-gray-600 flex items-center justify-center text-gray-300 text-xs h-40">
                        Sin imagen
                      </div>
                    )}
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
          )}
        </div>
      </div>
    </section>
  );
}
