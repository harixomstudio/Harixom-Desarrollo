import type React from "react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

interface SetProfileProps {
  title: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  link: string;
  buttonRegister?: React.ReactNode;
}

export default function Login(props: SetProfileProps) {
 

  const defaultImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  
    const [image, setImage] = useState<string>(defaultImage)
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImage(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }

  return (
    <section className="relative flex flex-col min-h-screen items-center justify-center bg-stone-950">
      
      <div className="flex flex-col items-center gap-4 w-full mt-20">
        {/* Imagen de perfil */}
        {image ? (
          <img
            src={image}
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-sm">
            Sin foto
          </div>
        )}

        {/* Input oculto */}
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Botón debajo */}
        <label
          htmlFor="file-upload"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full cursor-pointer text-sm shadow-md"
        >
          Agregar una foto
        </label>


        
      </div> {/* fin del div principal */}


        {/*Profiel*/}
      <div className="relative z-10 flex items-center justify-center w-full lg:w-3/4 mt-15 pb-16">
        <div className="w-full md:w-1/2 px-15 flex flex-col justify-center rounded-3xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            {props.title}
          </h2>

          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-sm mb-1 text-white">
                {props.name}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-white">
                {props.email}
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-white">
                {props.phone}
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-white">
                {props.address}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none text-white"
              />
            </div>

            <div className="flex justify-center mt-4 text-sm">
              <Link
                to="/Landing"
                className="ml-1 font-semibold underline hover:scale-105 duration-200 text-white text-lg"
              >
                {props.link}
              </Link>
            </div>

            {props.buttonRegister ? (
              props.buttonRegister
            ) : (
              <button
                type="submit"
                className="w-full py-2 mt-5 rounded-full text-white font-semibold bg-gradient-to-r from-pink-400 to-blue-400"
              >
                Save
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
