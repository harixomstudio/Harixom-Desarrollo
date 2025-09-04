import React from "react";
import { Link } from "@tanstack/react-router";
import axios from "axios";

interface ProfileProps {
  username: string;
  followers: number;
  address: string;
  description: string;
  profilePicture?: string;
  bannerPicture?: string;
  tabs?: string[];
  cards: { id: number; description: string; image?: string }[];
}

export default function Profile(props: ProfileProps) {
  const [cards, setCards] = React.useState(props.cards || []);

  const [activeTab, setActiveTab] = React.useState(0);
  const tabs = props.tabs || ["Home", "Commissions", "Muro"];

  // Estados para edición de Commissions
  const [editing, setEditing] = React.useState(false);
  const [services, setServices] = React.useState(
    "Fnasarts\nSibek\nMecha\nMega\nCore"
  );
  const [prices, setPrices] = React.useState(
    "Chibi: $10\nHalf body: $15\nFull body: $25"
  );
  const [terms, setTerms] = React.useState(
    "El pago completo se hace primero.\nUna vez realizado el dibujo se empezará.\nNo se aceptan reembolsos."
  );

  // Estados para el muro
  const [newComment, setNewComment] = React.useState("");
  const [comments, setComments] = React.useState([
    {
      user: "usernameanon",
      message:
        "I have no idea how to bookmark, click circle to something idk. Right...",
    },
  ]);

  return (
    <section className="relative flex items-center justify-center bg-stone-950 min-h-screen">
      <div className="w-full flex flex-col">
        {/* Banner */}
        <div className="relative mb-10">
          <div className="rounded-xl h-100 flex relative overflow-hidden w-full">

            {!props.bannerPicture ?
            <img src={props.bannerPicture} alt="" className="w-full h-full object-cover"/>
             :
            <img src="ChangeBanner.svg" alt="" className="w-full h-full object-cover" />
            }

            {/* Edit icon */}
            <div className="absolute right-8 bottom-8 cursor-pointer">
              <Link to="/SetProfile">
                <svg
                  width="24"
                  height="24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="text-gray-400 hover:text-pink-400"
                >
                  <path d="M12 19h9M16.5 7.5l4 4-9 9H7.5v-4z" />
                </svg>
              </Link>
            </div>
            {/* Avatar */}
            <div className="absolute left-5 bottom-2">
              <img
                src={
                  props.profilePicture ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="Avatar"
                className="w-30 h-30 rounded-full border-5 border-stone-950 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="pl-10 mt-2 mb-6">
          <div className="flex gap-25 text-white font-semibold text-2xl">
            <span>{props.username}</span>
            <span>Followers</span>
          </div>
          <div className="flex gap-19 text-gray-400 text-lg mb-1">
            <span>{props.address}</span>
            <span>{props.followers}</span>
          </div>
          <p className="text-gray-300 text-sm mt-2 py-15">
            {props.description}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-400 mb-8 px-4">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`pb-4 font-semibold text-xl px-5 ${activeTab === i
                  ? "text-pink-400 border-b-2 border-pink-400"
                  : "text-gray-200"
                }`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Contenido dinámico según tab */}
        <div className="w-full flex flex-col py-10 px-6">
          {activeTab === 1 ? (
            <>
              {/* Botón de edición */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setEditing(!editing)}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-full transition-all"
                >
                  {editing ? "Save Changes" : "Edit"}
                </button>
              </div>

              {/* Vista o formulario */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Servicios */}
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
                    <ul className="space-y-2 text-sm whitespace-pre-line">
                      {services}
                    </ul>
                  )}
                </div>

                {/* Precios */}
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
                    <ul className="space-y-2 text-sm whitespace-pre-line">
                      {prices}
                    </ul>
                  )}
                </div>

                {/* Términos */}
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
                    <ul className="space-y-2 text-sm whitespace-pre-line">
                      {terms}
                    </ul>
                  )}
                </div>
              </div>
            </>
          ) : activeTab === 2 ? (
            // Muro
            <div className="w-full max-w-4xl mx-auto">
              {/* Caja de comentario */}
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

              {/* Lista de comentarios */}
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
          ) : (
            // Posts (Cards)
            <div className="w-full  columns-4 max-lg:columns-2 max-md:columns-1">
              {cards.length ? (
                cards.map((card) => (
                  <div
                    key={card.id}
                    className="mb-6 rounded-2xl bg-stone-800 overflow-hidden relative "
                  >
                    {/* Botón eliminar */}
                    <button
                      onClick={async () => {
                        if (!card.id)
                          return alert("Esta publicación no tiene ID");
                        if (
                          confirm(
                            "¿Seguro que deseas eliminar esta publicación?"
                          )
                        ) {
                          try {
                            await axios.delete(
                              `http://127.0.0.1:8000/api/publications/${card.id}`,
                              {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                                },
                              }
                            );

                            // Actualiza el estado de las cards sin recargar
                            setCards((prev) =>
                              prev.filter((c) => c.id !== card.id)
                            );
                          } catch (error) {
                            console.error(
                              "Error al eliminar la publicación:",
                              error
                            );
                            alert("No se pudo eliminar la publicación.");
                          }
                        }
                      }}
                      className="absolute top-2 right-2 bg-pink-500 hover:bg-pink-600 text-white text-xs px-2 py-1 rounded"
                    >
                      ✕
                    </button>

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

      {/* Botón flotante para crear publicación */}
      <Link
        to="/CreatePublication"
        className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white text-lg font-bold py-3 px-5 rounded-full shadow-lg transition-all duration-300"
      >
        +
      </Link>
    </section>
  );
}
