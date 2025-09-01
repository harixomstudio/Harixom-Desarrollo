

const ARTISTS = [
  { id: 1, name: "Valeria Torres" },
  { id: 2, name: "Lucas Rivera" },
  { id: 3, name: "Andrea Gómez" },
  { id: 4, name: "Santiago Ruiz" },
  { id: 5, name: "Camila Flores" },
  { id: 6, name: "Mateo Jiménez" },
  { id: 7, name: "Isabella Díaz" },
  { id: 8, name: "Emilia Castro" },
  { id: 9, name: "Gabriel Silva" },
  { id: 10, name: "Sofía Pérez" },
  { id: 11, name: "Martín Herrera" },
  { id: 12, name: "Renata Morales" },
];

export default function FeedPage() {
  return (
    <div className="bg-stone-950 min-h-screen p-10">
      <div className="grid grid-cols-4 gap-10">
        {ARTISTS.map((artist) => (
          <div
            key={artist.id}
            className="flex flex-col items-center"
          >
            {/* Imagen con iconos superpuestos */}
            <div className="relative w-full aspect-square bg-gray-700 rounded-xl flex items-center justify-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Rosados.png/250px-Rosados.png"
                alt={artist.name}
                className="object-cover w-full h-full rounded-xl"
              />
              {/* Iconos en la esquina inferior derecha */}
              <div className="absolute bottom-3 right-3 flex flex-col items-end gap-2">
                <button className="text-white opacity-80" title="Like">
                  <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="1.5">
                    <circle cx="10" cy="10" r="8" />
                    <path d="M7 13c0-1.104.896-2 2-2s2 .896 2 2c0 1.104-2 3-2 3s-2-1.896-2-3z" />
                  </svg>
                </button>
                <button className="text-white opacity-80" title="Comentar">
                  <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="1.5">
                    <circle cx="10" cy="10" r="8" />
                    <ellipse cx="10" cy="13" rx="4" ry="2" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Nombre y tres puntos abajo */}
            <div className="w-full flex items-center justify-between mt-2 px-1">
              <span className="text-xs text-gray-200 font-semibold">{artist.name}</span>
              <span className="text-gray-400 text-xl font-bold" title="Opciones">...</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}