
import type React from "react";
import { Link } from "@tanstack/react-router";

interface LoginProps {
  title: string;
  email: string;
  password: string;
  text: string;
  link: string;
  buttonLogin?: React.ReactNode;
}

export default function Login(props: LoginProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-stone-950">
      <img
        src="/circles.svg"
        alt="circles background"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="relative z-10 flex lg:w-3/4">
        
    
        <div className="md:flex w-1/2 flex-col items-center justify-center text-center p-8">
          <p className="text-lg text-white">Welcome to</p>
         <h1
    className="mt-4 text-5xl md:text-7xl text-pink-500"
    style={{ fontFamily: 'Starstruck' }}>
            HARIXOM
          </h1>
        </div>

   
        <div className="w-full md:w-1/2 bg-gray-200 opacity-90 p-10 py-25 px-15 flex flex-col justify-center rounded-3xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-black">
            {props.title}
          </h2>

          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                {props.email}
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">
                {props.password}
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
            </div>

           
            {props.buttonLogin ? (
              props.buttonLogin
            ) : (
              <button
                type="submit"
                className="w-full py-2 mt-4 rounded-full text-white font-semibold bg-gradient-to-r from-pink-400 to-blue-400"
              >
                LOGIN
              </button>
            )}
          </form>

        
          <div className="flex justify-center mt-4 text-sm">
            <p className="text-gray-700">{props.text}</p>
            <Link
              to="/Register"
              className="ml-1 font-semibold underline hover:scale-105 duration-200"
            >
              {props.link}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
