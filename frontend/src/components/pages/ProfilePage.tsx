import React from "react";
import { Link } from "@tanstack/react-router";
import axios from "axios";
import { useToast } from "../ui/Toast";

interface ProfileProps {
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
  services: string;
  prices: string;
  terms: string;
}

export default function Profile(props: ProfileProps) {
  const { showToast } = useToast();

  const [showFollowers, setShowFollowers] = React.useState(false);
  const [showFollowings, setShowFollowings] = React.useState(false);
  const [cards, setCards] = React.useState(props.cards || []);
  const [favorites, setFavorites] = React.useState(props.likes || []);
  const [followers, setFollowers] = React.useState(props.followers || []);
  const [followings, setFollowings] = React.useState(props.followings || []);
  const [activeTab, setActiveTab] = React.useState(0);
  const tabs = props.tabs || ["Home", "Commissions", "Feed", "Favorites"];
  const [deleteModalOpen, setDeleteModalOpen] = React.useState<number | null>(
    null
  );
  const [editing, setEditing] = React.useState(false);
  const [services, setServices] = React.useState<string>(props.services ?? "");
  const [prices, setPrices] = React.useState<string>(props.prices ?? "");
  const [terms, setTerms] = React.useState<string>(props.terms ?? "");

  const [newComment, setNewComment] = React.useState("");
  const [comments, setComments] = React.useState([
    {
      user: "usernameanon",
      message:
        "I have no idea how to bookmark, click circle to something idk. Right...",
    },
  ]);

  React.useEffect(() => setCards(props.cards || []), [props.cards]);
  React.useEffect(() => setFavorites(props.likes || []), [props.likes]);
  React.useEffect(() => setFollowers(props.followers || []), [props.followers]);
  React.useEffect(() => setFollowings(props.followings || []), [props.followings]);
  

  const handleDeletePublication = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/publications/${id}`, {
        headers: {
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
        `http://127.0.0.1:8000/api/like/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
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
        "http://127.0.0.1:8000/api/user/profile",
        {
          services,
          prices,
          terms,
        },
        {
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


  return (
    <section className="relative flex items-center justify-center bg-stone-950 min-h-screen"
     style={{ fontFamily: "Monserrat" }}>
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
            <div className="absolute right-8 bottom-8 cursor-pointer">
              <Link to="/SetProfile">
                <svg
                  width="100"
                  height="56"
                  viewBox="0 0 32 32"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  className="text-gray-400 hover:text-pink-400"
                  fill="none"
                >
                  <path d="M16 25h12M22 10.5l5.5 5.5-12.5 12.5H10.5v-5z" />
                </svg>
              </Link>
            </div>
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


{/* Info */}
<div className="flex flex-col pl-10 text-white mt-6 mb-10">
  {/* Username */}
  <span className="text-3xl font-bold mb-2">{props.username}</span>

     <Link
            to="/DigitalArt"
            className="absolute right-6 py-4 px-7 bg-green-400 text-2xl font-bold rounded-full hover:scale-125 transition z-10"
            style={{ fontFamily: "Monserrat" }}
          >
          $
          </Link>

  {/* Description */}
  <span className="text-gray-400 text-lg mb-6">{props.address}</span>

  {/* Followers & Followings  */}
  <div className="flex gap-20 text-white font-semibold text-xl mb-2">
    <span
      className="cursor-pointer hover:text-pink-400 flex flex-col items-center"
      onClick={() => setShowFollowers(true)}
    >
      <span>Followers</span>
      <span className="text-gray-300 text-lg font-normal">
        {props.followers.length}
      </span>
    </span>
    <span
      className="cursor-pointer hover:text-pink-400 flex flex-col items-center"
      onClick={() => setShowFollowings(true)}
    >
      <span>Followings</span>
      <span className="text-gray-300 text-md font-normal">
        {props.followings.length}
      </span>
    </span>

    
  </div>



          {/* Followers Modal */}
          {showFollowers && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-stone-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
                <h3 className="text-pink-400 font-bold mb-6">Followers</h3>
                <ul>
                  {props.followers.map((f) => (
                    <li
                      key={f.id}
                      className="text-gray-200 mb-2 flex items-center gap-2"
                    >
                      <img
                        src={f.profile_picture}
                        className="w-6 h-6 rounded-full"
                      />
                      {f.name}
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-4 px-4 py-2 bg-pink-500 text-white rounded"
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
                <h3 className="text-pink-400 font-bold mb-4">Followings</h3>
                <ul>
                  {props.followings.map((f) => (
                    <li
                      key={f.id}
                      className="text-gray-200 mb-2 flex items-center gap-2"
                    >
                      <img
                        src={f.profile_picture}
                        className="w-6 h-6 rounded-full"
                      />
                      {f.name}
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-4 px-4 py-2 bg-pink-500 text-white rounded"
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
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-400 mb-8 px-4">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`pb-4 font-semibold text-xl px-5 ${
                activeTab === i
                  ? "text-pink-400 border-b-2 border-pink-400"
                  : "text-gray-200"
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
                    <button
                      onClick={() => setDeleteModalOpen(card.id)}
                      className="absolute top-2 right-2 bg-pink-500 hover:bg-pink-600 text-white text-xs px-2 py-1 rounded"
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

      {/* Botón flotante */}
      <Link
        to="/CreatePublication"
        className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white text-lg font-bold py-5 px-7 rounded-full shadow-lg transition-all duration-300"
      >
        +
      </Link>
    </section>
  );
}
