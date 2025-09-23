import React, { useState } from "react";

interface CategoriesPageProps {
  publication: {
    id: number;
    image?: string;
    user_name?: string;
    description?: string;
    liked?: boolean;
    likesCount?: number;
    isFollowing?: boolean;
    commentsCount?: number;
    profilePicture?: string;
    category?: string; // Agregado para la categoría
  };
  onLike: (id: number) => void;
  onComment: (id: number) => void;
}

export default function CategoriesPage({ publication }: CategoriesPageProps) {
  const [liked, setLiked] = useState(publication.liked || false);
  const [likesCount, setLikesCount] = useState(publication.likesCount || 0);
  const [isFollowing, setIsFollowing] = useState(publication.isFollowing || false);
  const [commentsCount, setCommentsCount] = useState(publication.commentsCount || 0);
  const [showComments, setShowComments] = useState(false);

  // Simula lógica de like
  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikesCount((prev) => liked ? prev - 1 : prev + 1);
    // Aquí iría la petición al backend
  };

  // Simula lógica de seguir
  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
    // Aquí iría la petición al backend
  };

  // Simula abrir comentarios
  const handleComment = () => {
    setShowComments(true);
    // Aquí podrías abrir un modal de comentarios
  };

  return (
    <div className="bg-[#151515] rounded-2xl overflow-hidden flex flex-col w-[340px] h-[460px]">
      {/* Imagen */}
      <div className="relative w-full h-[340px] aspect-square flex items-center justify-center">
        {/* Avatar y nombre sobre la imagen */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          <img
            src={publication.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
            alt="Avatar"
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
          />
          <span className="text-white font-semibold text-sm drop-shadow">
            {publication.user_name || "ArtistUser"}
          </span>
        </div>
        {/* Imagen principal */}
        {publication.image ? (
          <img
            src={publication.image}
            alt={publication.description}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-500 flex items-center justify-center text-gray-300 text-xs">
            {/* Placeholder */}
          </div>
        )}
      </div>
      {/* Footer estilo Instagram */}
      <div className="flex flex-row justify-between items-center px-4 py-5 bg-[#151515]">
        <div className="flex flex-row gap-5 items-center">
          {/* Botón like */}
          <button
            className={`opacity-80 flex flex-row items-center gap-1 ${liked ? "text-red-500" : "text-gray-300"}`}
            title="Like"
            onClick={handleLike}
          >
            <svg
              width="28"
              height="28"
              fill={liked ? "red" : "none"}
              stroke="white"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 21s-1-.5-2-1.5S5 14 5 10.5 8 5 12 8s7-2 7 2.5-5 9-5 9-1 1-2 1z" />
            </svg>
            <span className="text-xs">{likesCount}</span>
          </button>
          {/* Botón comentario */}
          <button
            className="text-gray-300 opacity-80 flex flex-row items-center gap-1"
            title="Comentar"
            onClick={handleComment}
          >
            <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-xs">{commentsCount}</span>
          </button>
          {/* Botón seguir */}
          <button
            className={`opacity-80 flex items-center justify-center ${isFollowing ? "text-pink-500" : "text-gray-300"}`}
            title={isFollowing ? "Siguiendo" : "Seguir"}
            onClick={handleFollow}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isFollowing ? "#ec4899" : "white"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
          {/* Categoría */}
          <span className="ml-15 text-gray-300 font-semibold">
            {publication.category}
          </span>
        </div>
      </div>
      {/* Nombre de la obra debajo de los botones */}
      <div className="px-4 ">
        <span className="text-base text-white font-bold block ">
          {publication.description || "Sin título"}
        </span>
      </div>
      {/* Aquí podrías renderizar el modal de comentarios si showComments es true */}
    </div>
  );
}