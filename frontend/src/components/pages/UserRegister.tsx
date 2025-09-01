import type React from "react";


interface UserRegisterProps {
  title: string;
}


export default function UserRegister(props: UserRegisterProps) {
  return (
    <section className="min-h-screen bg-stone-950 p-8">
      {/* Título principal */}
      <div className="mb-8 pl-4">
        <h2
          className="text-2xl font-bold"
          style={{ color: "#ec4899", fontFamily: "Starstruck, inherit" }}
        >
          Registro De Usuarios
        </h2>
      </div>
      
      {/* Card contenedor */}
      <div className="w-full max-w-6xl mx-auto bg-stone-900 rounded-lg p-0 relative flex flex-col items-center shadow-lg">

        {/* Tabla */}
        <div className="w-full mt-10 px-10 pb-10 flex flex-col items-center">
          <div className="w-full rounded-t-lg overflow-hidden shadow-lg">
            {/* Encabezado morado */}
            <div className="w-full h-2"></div>
            <div className="bg-stone-900 text-center py-2">
              <h1 className="text-gray-300 font-semibold">{props.title}</h1>
            </div>
            <table className="w-full border-collapse rounded-b-lg overflow-hidden">
              <thead>
                <tr className="bg-stone-900">
                  <th className="border border-stone-700 px-4 py-2 text-white font-semibold">Image</th>
                  <th className="border border-stone-700 px-4 py-2 text-white font-semibold">User</th>
                  <th className="border border-stone-700 px-4 py-2 text-white font-semibold">Email</th>
                  <th className="border border-stone-700 px-4 py-2 text-white font-semibold">Phone</th>
                  <th className="border border-stone-700 px-4 py-2 text-white font-semibold">Address</th>
                  <th className="border border-stone-700 px-4 py-2 text-white font-semibold">Profile Completed</th>
                </tr>
              </thead>
              <tbody>
                {/* 4 filas vacías como la imagen */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="bg-stone-800">
                    {[...Array(6)].map((_, j) => (
                      <td
                        key={j}
                        className="border border-stone-700 px-4 py-3 text-gray-300 h-12"
                      ></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="w-full max-w-4xl mx-auto flex justify-between mt-12 px-2">
        <button
          type="button"
          className="px-8 py-2 rounded-full font-semibold text-black bg-gradient-to-r from-teal-300 to-green-300 hover:shadow-lg border-2 border-teal-300"
        >
          Create user
        </button>
        <button
          type="button"
          className="px-8 py-2 rounded-full font-semibold text-black bg-yellow-400 hover:shadow-lg"
        >
          Enable user
        </button>
        <button
          type="button"
          className="px-8 py-2 rounded-full font-semibold text-black bg-pink-400 hover:shadow-lg"
        >
          Disable user
        </button>
        <button
          type="button"
          className="px-8 py-2 rounded-full font-semibold text-black bg-pink-400 hover:shadow-lg"
        >
          Logout
        </button>
      </div>
    </section>
  );
}