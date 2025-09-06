import React, { useState } from "react";
import { useToast } from "../ui/ToastContext";
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
  const { showToast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState<{ id: number | null, open: boolean }>({ id: null, open: false });

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

            <div className="flex relative w-full h-full items-center justify-center">
              <img src={props.bannerPicture} alt="" className="w-full h-full object-cover" />
              {props.bannerPicture === "https://img.freepik.com/foto-gratis/fondo-textura-abstracta_1258-30553.jpg?semt=ais_incoming&w=740&q=80" ?  <h2 className="absolute max-lg:text-3xl max-xl:text-4xl duration-500 transform text-6xl font-berkshire text-pink-400">Change banner</h2> : ''}
            </div>

            {/* Edit icon */}
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
            {/* Avatar */}
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
        <div className="pl-10 mt-2 mb-6">
          <div className="flex gap-25 text-white font-semibold text-2xl">
            <span>{props.username}</span>
            <span>Followers</span>
          </div>
          <div className="flex gap-35 text-gray-400 text-lg mb-1">
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
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-pink-400 via-blue-400 to-purple-400 p-1 rounded-full">
                    <img
                      src={props.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover border-4 border-stone-950"
                    />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escribe un comentario..."
                      className="w-full bg-stone-900/80 text-gray-200 p-4 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 border border-stone-700 shadow-md backdrop-blur-sm transition-all placeholder:text-pink-300"
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
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white font-bold px-6 py-2 rounded-full shadow-lg transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Publicar
                      </button>
                    </div>
                  </div>
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

            <div className="w-full columns-4 max-lg:columns-2 max-md:columns-1">

              {cards.length ? (
                cards.map((card) => (
                  <div
                    key={card.id}

                    className="mb-6 rounded-2xl bg-stone-800 overflow-hidden relative "

                  >
                    {/* Botón eliminar */}
                    <button
                      onClick={() => {
                        if (!card.id) {
                          showToast("Esta publicación no tiene ID", "error");
                          return;
                        }
                        setConfirmDelete({ id: card.id, open: true });
                      }}
                      className="absolute top-2 right-2 bg-pink-500 hover:bg-pink-600 text-white text-xs px-2 py-1 rounded"
                    >
                      ✕
                    </button>
      {/* Modal de confirmación para eliminar publicación */}
      {confirmDelete.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
            <p className="mb-4 text-lg text-gray-800 font-semibold">¿Seguro que deseas eliminar esta publicación?</p>
            <div className="flex gap-4">
              <button
                className="px-6 py-2 rounded-full font-semibold text-white bg-gray-500 hover:bg-gray-600"
                onClick={() => setConfirmDelete({ id: null, open: false })}
              >
                Cancelar
              </button>
              <button
                className="px-6 py-2 rounded-full font-semibold text-white bg-pink-500 hover:bg-pink-600"
                onClick={async () => {
                  try {
                    await axios.delete(
                      `http://127.0.0.1:8000/api/publications/${confirmDelete.id}`,
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                      }
                    );
                    setCards((prev) => prev.filter((c) => c.id !== confirmDelete.id));
                    showToast("Publicación eliminada", "success");
                  } catch (error) {
                    console.error("Error al eliminar la publicación:", error);
                    showToast("No se pudo eliminar la publicación.", "error");
                  } finally {
                    setConfirmDelete({ id: null, open: false });
                  }
                }}
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
                <p className="text-gray-400 text-sm text-center col-span-3 ">
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
