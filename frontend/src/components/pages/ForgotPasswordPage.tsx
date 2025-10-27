import React, { useState } from "react";
import { axiosRequest } from "../helpers/config";
import { useToast } from "../ui/Toast";

interface ForgotPasswordProps {
  title: string;
  email: string;
  buttonText: string;
  successMessage: string;
}

export default function ForgotPassword(props: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosRequest.post("forgot-password", { email });
      showToast(response.data.message || props.successMessage);
    } catch (error: any) {
      showToast(
        error.response?.data?.error || "Error al enviar el correo.",
        "error"
      )

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-stone-950" style={{ fontFamily: "Montserrat" }}>
      <img
        src="/circles.svg"
        alt="circles background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      <div className="relative z-10 flex lg:w-3/4 max-lg:flex-col max-lg:items-center max-lg:justify-center">
        <div className=" md:flex w-1/2 flex-col items-center justify-center text-center p-8 max-lg:w-full">
          <p className="text-lg text-white max-lg:w-full">Reset access to</p>
          <h1
            className="mt-4 text-5xl md:text-7xl text-pink-500"
            style={{ fontFamily: "Starstruck" }}
          >
            HARIXOM
          </h1>
        </div>

        <div className="w-full xl:w-1/2 bg-gray-200 opacity-90 p-10 flex flex-col justify-center rounded-3xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-black">
            {props.title}
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                {props.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 mt-4 rounded-full text-white font-semibold cursor-pointer hover:scale-105 transform duration-500 ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-400 to-blue-400"
                }`}
              disabled={loading}
            >
              {loading ? "Sending..." : props.buttonText}
            </button>
          </form>
            <a href="/Login" className="mt-4 text-sm underline underline-offset-3 text-pink-400 w-full text-center font-bold">Back to Login</a>
        </div>
      </div>
    </section>
  );
}
