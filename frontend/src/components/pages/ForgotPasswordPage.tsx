import React, { useState } from "react";
import { axiosRequest } from "../helpers/config";

interface ForgotPasswordProps {
  title: string;
  email: string;
  buttonText: string;
  successMessage: string;
}

export default function ForgotPassword(props: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  console.log("📧 Email a enviar:", email);

  try {
    const response = await axiosRequest.post(
      "https://harixom-desarrollo.onrender.com/api/forgot-password",
      { email }
    );

    console.log("✅ Response completa:", response);
    console.log("📄 Response data:", response.data);

    alert(response.data.message || props.successMessage);
  } catch (error: any) {
    console.error("❌ Error capturado:", error);

    // Log detallado del error
    if (error.response) {
      console.log("⚠️ Error response data:", error.response.data);
      console.log("⚠️ Error response status:", error.response.status);
      console.log("⚠️ Error response headers:", error.response.headers);
    } else if (error.request) {
      console.log("⚠️ Error request:", error.request);
    } else {
      console.log("⚠️ Error message:", error.message);
    }

    alert(error.response?.data?.error || "Error al enviar el correo.");
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-stone-950">
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

        <div className="w-full md:w-1/2 bg-gray-200 opacity-90 p-10 flex flex-col justify-center rounded-3xl">
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
