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
      <div className="w-full flex flex-col lg:flex-row">
        {/* Lado izquierdo */}
        <div className="w-full lg:w-1/3 flex flex-col pt-4">
          {/* Banner */}
          <div className="relative mb-8">
            <div
              className="rounded-xl h-70 flex items-end relative"
              style={{
                backgroundImage: `url(${
                  props.bannerPicture ||
                  "https://via.placeholder.com/1200x300/444/fff?text=Banner"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
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
                className={`pb-2 font-semibold text-base ${
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
        </div>

        {/* Lado derecho (Cards) */}
        <div className="w-full lg:w-2/3 flex py-10 px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
            {props.cards.length ? (
              props.cards.map((card, i) => (
                <div
                  key={i}
                  className="rounded-lg flex flex-col items-center justify-center"
                >
                  <div className="w-90 h-90 bg-gray-400 rounded-lg mb-2 overflow-hidden">
                    {card.image ? (
                      <img
                        src={card.image}
                        alt={`Card ${i}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-300 text-xs">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-200 text-center px-2">
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
    </section>
  );
}
