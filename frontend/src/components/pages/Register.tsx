import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { axiosRequest } from "../helpers/config";

interface RegisterProps {
  title: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
  text: string;
  link: string;
}

interface UserForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
}

export default function Register(props: RegisterProps) {
  const [user, setUser] = useState<UserForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (field: "profile_picture" | "banner_picture", file: File | null) => {
    setUser({ ...user, [field]: file });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const registerNewUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (user.password !== user.confirmPassword) {
      alert("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("phone", user.phone);
    formData.append("address", user.address);
    formData.append("password", user.password);

    try {
      const response = await axiosRequest.post("user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLoading(false);
      alert(response.data.message);
      navigate({ to: "/Login" });
    } catch (error: any) {
      setLoading(false);
      if (error.response) {
        console.error("Backend error response:", error.response);
        alert(`Error del servidor: ${error.response.data.message || JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error("No response from server:", error.request);
        alert("No se recibió respuesta del servidor.");
      } else {
        console.error("Error inesperado:", error.message);
        alert(`Error inesperado: ${error.message}`);
      }
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
          <p className="text-lg text-white">Welcome to</p>
          <h1 className="mt-4 text-5xl md:text-7xl text-pink-500" style={{ fontFamily: "Starstruck" }}>
            HARIXOM
          </h1>
        </div>

        <div className="w-full md:w-1/2 bg-gray-200 opacity-90 p-10 py-25 px-15 flex flex-col justify-center rounded-3xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-black">{props.title}</h2>

          <form className="flex flex-col gap-4" onSubmit={registerNewUser}>
            {(["name", "email", "phone", "address", "password", "confirmPassword"] as const).map((field) => (
              <div key={field}>
                <label className="block text-sm mb-1 text-gray-700">{props[field]}</label>
                <div className="relative">
                  <input
                    type={field === "confirmPassword" ? (showConfirmPassword ? "text" : "password") : field === "password" ? (showPassword ? "text" : "password") : "text"}
                    value={user[field]}
                    onChange={(e) => setUser({ ...user, [field]: e.target.value })}
                    className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
                  />
                  {(field === "confirmPassword" || field === "password") && (
                    <button
                      type="button"
                      onClick={field === "confirmPassword" ? toggleConfirmPasswordVisibility : togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {field === "confirmPassword" ? (showConfirmPassword ? "🙈" : "👁️") : showPassword ? "🙈" : "👁️"}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="submit"
              className={`w-full py-2 mt-4 rounded-full text-white font-semibold ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-pink-400 to-blue-400"
              }`}
              disabled={loading}
            >
              {loading ? "Registering..." : "REGISTER"}
            </button>
          </form>

          <div className="flex justify-center mt-4 text-sm">
            <p className="text-gray-700">{props.text}</p>
            <Link
              to="/Login"
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
