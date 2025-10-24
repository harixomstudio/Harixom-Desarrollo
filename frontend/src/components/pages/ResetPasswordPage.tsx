import React, { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { axiosRequest } from "../helpers/config";

import { useToast } from "../ui/Toast";

interface ResetPasswordProps {
  title: string;
  password: string;
  confirmPassword: string;
  buttonText: string;
}

export default function ResetPassword(props: ResetPasswordProps) {
  const { showToast } = useToast();

  const navigate = useNavigate();
  const search = useSearch({ from: "/ResetPassword" as any });
  const { token, email } = search as { token: string; email: string };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  console.log("Iniciando reset de contraseña...");
  console.log("Password:", password);
  console.log("ConfirmPassword:", confirmPassword);
  console.log("Token:", token);
  console.log("Email:", email);

  if (password !== confirmPassword) {
    showToast("Las contraseñas no coinciden", "error");
    console.warn("Contraseñas no coinciden");
    return;
  }

  setLoading(true);

  try {
    console.log("Enviando request a backend...");
    const response = await axiosRequest.post(
      "https://harixom-desarrollo.onrender.com/api/reset-password",
      {
        email,
        token,
        password,
        password_confirmation: confirmPassword,
      }
    );

    console.log("Respuesta del backend:", response.data);

    showToast(response.data.message || "Contraseña cambiada con éxito");
    navigate({ to: "/Login" });
  } catch (error: any) {
    console.error("Error en la petición Axios:", error);

    // Mostrar datos de la respuesta para depuración más profunda
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("Request hecho pero sin respuesta:", error.request);
    } else {
      console.error("Error inesperado:", error.message);
    }

    showToast(
      error.response?.data?.error || "Error al cambiar la contraseña",
      "error"
    );
  } finally {
    setLoading(false);
    console.log("Proceso terminado");
  }
};


  return (
    <section className="relative flex min-h-screen items-center justify-center bg-stone-950">
      <img
        src="/circles.svg"
        alt="circles background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      <div className="relative z-10 flex lg:w-3/4">
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center text-center p-8">
          <p className="text-lg text-white">Set a new password for</p>
          <h1
            className="mt-4 text-5xl md:text-7xl text-pink-500"
            style={{ fontFamily: "Starstruck" }}
          >
            HARIXOM
          </h1>
        </div>

        <div className="w-full md:w-1/2 bg-gray-200 opacity-90 p-10 flex flex-col justify-center rounded-3xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-black">
            {props.title}
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleReset}>
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                {props.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">
                {props.confirmPassword}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 mt-4 rounded-full text-white font-semibold ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-400 to-blue-400"
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : props.buttonText}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
