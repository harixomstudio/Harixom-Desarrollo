import React from "react";

interface ProfileProps {
  username: string;
  followers: number;
  address: string;
  description: string;
  tabs?: string[];
  cards: { description: string }[];
}

export default function Profile(props: ProfileProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  const tabs = props.tabs || ["Home", "Art", "Commissions", "Muro"];

  return (
    <section className="relative flex items-center justify-center bg-stone-950">
      <div>
          <div className="relative  flex">
        {/* Info (izquierda) */}
        <div className="w-full flex flex-col pt-4">
          {/* Banner */}
          <div className="relative mb-8">
            <div className="bg-neutral-800 rounded-xl h-70 px-10 flex items-end">
              {/* Edit icon */}
              <div className="absolute right-8 bottom-8 cursor-pointer">
                <svg width="24" height="24" stroke="currentColor" strokeWidth={2} className="text-gray-400">
                  <path d="M12 19h9M16.5 7.5l4 4-9 9H7.5v-4z" />
                </svg>
              </div>
              {/* Avatar */}
              <div className="absolute left-5 bottom-2">
                <div className="w-30 h-30 rounded-full bg-gray-200 border-5 border-stone-950 flex items-center justify-center">
                  <svg width="44" height="44">
                    <circle cx="22" cy="16" r="9" fill="#6B7280" />
                    <ellipse cx="22" cy="33" rx="13" ry="7" fill="#6B7280" />
                  </svg>
                </div>
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
            <p className="text-gray-300 text-sm mt-2 py-15">{props.description}</p>
          </div>
          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-400 mb-8 px-4">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                className={`pb-2 font-semibold text-base ${
                  activeTab === i ? "text-pink-400 border-b-2 border-pink-400" : "text-gray-200"
                }`}
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    <div>
       {/* Cards grid (derecha) */}
        <div className="flex py-10">
          <div className="grid grid-cols-3 gap-10">
            {(props.cards.length ? props.cards : Array.from({ length: 9 }, (_, i) => ({ description: "is simply dummy text of the printing and typesetting industry." })))
              .map((card, i) => (
                <div key={i} className=" rounded-lg  flex flex-col items-center justify-center">
                  <div className="w-90 h-90 bg-gray-400 rounded-lg mb-2" />
                  <p className="text-xs text-gray-200 text-center px-2">{card.description}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
       
    </section>
  );
}