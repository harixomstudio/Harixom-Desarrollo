import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { axiosRequest } from "../helpers/config";
import TermsAndConditions from "./TermsAndConditionsPage";

import { useToast } from "../ui/Toast";

interface LoginProps {
  title: string;
  email: string;
  password: string;
  text: string;
  link: string;
}

interface UserForm {
  email: string;
  password: string;
}

export default function Login(props: LoginProps) {
  const { showToast } = useToast();

  const [user, setUser] = useState<UserForm>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosRequest.post("user/login", user);
      setLoading(false);

      if (response.data.error) {
        alert(response.data.error);
      } else {
        // No guardamos el token aún
        setTempToken(response.data.access_token);
        setShowTerms(true);
      }
    } catch (error: any) {
      setLoading(false);
      if (error.response) {
        showToast(
          `Error del servidor: ${error.response.data.message || JSON.stringify(error.response.data)}`,
          "error"
        );
      } else if (error.request) {
        showToast("No se recibió respuesta del servidor.", "error");
      } else {
        showToast(`Error inesperado: ${error.message}`, "error");
      }
    }
  };

  const handleAcceptTerms = () => {
    if (tempToken) {
      localStorage.setItem("access_token", tempToken);
      navigate({ to: "/Landing" });
    }
  };

  if (showTerms) {
    return (
      <TermsAndConditions
        title="Términos y Condiciones"
        onAccept={handleAcceptTerms}
      />
    );
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-stone-950">
      <img
        src="/circles.svg"
        alt="circles background"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      <div className="relative z-10 flex w-3/4 max-lg:flex-col ">
        <div className="md:flex w-1/2 flex-col items-center justify-center text-center p-8 max-lg:w-full">
          <p className="text-lg text-white max-lg:justify-center">Welcome to</p>
          <h1
            className="mt-10 text-5xl md:text-7xl text-pink-500 flex gap-1 max-lg:w-full max-lg:justify-center"
            style={{ fontFamily: "Starstruck" }}
          >
            {"HARIXOM".split("").map((char, i) => (
              <span
                key={i}
                className="inline-block animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.5s",
                  animationIterationCount: "infinite",
                  animationTimingFunction: "ease-in-out",
                  display: "inline-block",
                }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        <div className="w-full min-xl:w-1/2 bg-gray-200 opacity-90 p-10 py-25 px-15 flex flex-col justify-center rounded-3xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-black">
            {props.title}
          </h2>

          <form className="flex flex-col gap-4" onSubmit={loginUser}>
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                {props.email}
              </label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
            </div>

            <div className="relative">
              <label className="block text-sm mb-1 text-gray-700">
                {props.password}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-sm"
                onClick={() => setShowPassword(!showPassword)}
              ><img
                  src={showPassword ? "ojociego.svg" : "ojoabierto.svg"}
                  alt={showPassword ? "Ojo cerrado" : "Ojo abierto"}
                  className="w-6 h-6"
                />
              </button>
            </div>

            <button
              type="submit"
              className={`w-full py-2 mt-4 rounded-full text-white font-semibold ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-400 to-blue-400"
                }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <div className="flex justify-center mt-3 text-sm">
            <Link
              to="/ForgotPassword"
              className="text-pink-500 font-semibold underline underline-offset-2 hover:scale-105 duration-200"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="flex justify-center mt-4 text-sm">
            <p className="text-gray-700">{props.text}</p>
            <Link
              to="/Register"
              className="ml-1 font-semibold underline underline-offset-2 hover:scale-105 duration-200"
            >
              {props.link}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
