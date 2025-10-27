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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast("Las contraseñas no coinciden", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosRequest.post("reset-password", {
        email,
        token,
        password: password,
        password_confirmation: confirmPassword,
      });

      showToast(response.data.message || "Contraseña cambiada con éxito");
      navigate({ to: "/Login" });
    } catch (error: any) {
      console.error(error);
      showToast(
        error.response?.data?.error || "Error al cambiar la contraseña",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordMatch = () => {
    if (password === confirmPassword || confirmPassword === "" || password === "") { return true }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-stone-950" style={{ fontFamily: "Montserrat" }}>
      <img
        src="/circles.svg"
        alt="circles background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      <div className="relative z-10 flex lg:w-3/4 max-md:flex-col">
        <div className=" md:flex w-1/2 flex-col items-center justify-center text-center p-8 max-lg:w-full">
          <p className="text-lg text-white max-lg:justify-center">Set a new password for</p>
          <h1
            className="mt-4 text-5xl md:text-7xl text-pink-500"
            style={{ fontFamily: "Starstruck" }}
          >
            HARIXOM
          </h1>
        </div>

        <div className="w-full min-xl:w-1/2 bg-gray-200 opacity-90 p-10 flex flex-col justify-center rounded-3xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-black">
            {props.title}
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleReset}>
            <div className="relative">
              <label className="block text-sm mb-1 text-gray-700">
                {props.password}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <div className="relative">
              <label className="block text-sm mb-1 text-gray-700">
                {props.confirmPassword}
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border-b mb-1 border-gray-400 bg-transparent focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-sm"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ><img
                  src={showConfirmPassword ? "ojociego.svg" : "ojoabierto.svg"}
                  alt={showConfirmPassword ? "Ojo cerrado" : "Ojo abierto"}
                  className="w-6 h-6"
                />
              </button>
              <p className='max-xl:text-sm text-red-600 animate-pulse max-md:text-xs max-[30rem]:text-[0.6rem]'>{passwordMatch() ? '' : 'Password does not match'}</p>
            </div>

            <button
              type="submit"
              className={`w-full py-2 mt-4 rounded-full text-white font-semibold ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-400 to-blue-400"
                }`}
              disabled={loading}
            >
              {loading ? "Updating..." : props.buttonText}
            </button>
          </form>
          <a href="/Login" className="mt-4 text-sm underline underline-offset-3 text-pink-400 w-full text-center font-bold">Cancel Password Reset</a>
        </div>
      </div>
    </section>
  );
}
