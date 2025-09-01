import React from "react";
import { Link } from "@tanstack/react-router";

interface ProfileProps {
  username: string;
  followers: number;
  address: string;
  description: string;
  profilePicture?: string;
  bannerPicture?: string;
  tabs?: string[];
  cards: { description: string; image?: string }[];
}

export default function Profile(props: ProfileProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  const tabs = props.tabs || ["Home", "Art", "Commissions", "Muro"];

  return (
    <section className="relative flex items-center justify-center bg-stone-950 min-h-screen">
      <div className="w-full flex flex-col">
        {/* Banner */}
        <div className="relative mb-10">
          <div className="rounded-xl h-100 flex relative overflow-hidden w-full">

              <img src={props.bannerPicture} alt="" className="w-full h-full object-cover"/> {/*banner image */}
           

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
          <div className="flex gap-25 text-white font-semibold text-base">
            <span>{props.username}</span>
            <span>Followers</span>
          </div>
          <div className="flex gap-19 text-gray-400 text-sm mb-1">
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
              className={`pb-2 font-semibold text-base ${activeTab === i
                ? "text-pink-400 border-b-2 border-pink-400"
                : "text-gray-200"
                }`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Posts (Cards) */}
        <div className="w-full flex py-10 px-6">
          <div className="w-full" style={{ columnCount: 4, columnGap: "1rem" }}>
            {props.cards.length ? (
              props.cards.map((card, i) => (
                <div
                  key={i}
                  className="mb-6 break-inside-avoid rounded-lg bg-stone-800 overflow-hidden"
                >
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={`Card ${i}`}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
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
        </div>
      </div>

      {/* Botón flotante para crear publicación */}
      <Link
        to="/CreatePublication"
        className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white text-lg font-bold py-3 px-5 rounded-full shadow-lg transition-all duration-300"
      >
        +
      </Link>
    </section >
  );
}
