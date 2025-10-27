import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { axiosRequest } from "../helpers/config";

import { useToast } from "../ui/Toast";

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
  const { showToast } = useToast();

  const [user, setUser] = useState<UserForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePhone = (value: string) => {
    const regex = /^\+\d{1,3}\d{4,14}$/;
    if (value && !regex.test(value)) {
      setPhoneError("The phone number example: +50612345678");
    } else {
      setPhoneError("");
    }
  };

  const validateName = (value: string) => {
    const regex = /^[^\s]+$/;
    if (value && !regex.test(value)) {
      setNameError("The name field cannot contain spaces.");
    } else {
      setNameError("");
    }
  };

  const registerNewUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (user.password !== user.confirmPassword) {
      showToast("Passwords do not match", "error");
      setLoading(false);
      return;
    }

    if (phoneError || nameError) {
      showToast("Please correct the errors before continuing.", "error");
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
      showToast(response.data.message, "success");
      navigate({ to: "/Login" });
    } catch (error: any) {
      setLoading(false);
      if (error.response) {
        console.error("Backend error response:", error.response);
        showToast(
          `Error del servidor: ${error.response.data.message || JSON.stringify(error.response.data)}`,
          "error"
        );
      } else if (error.request) {
        console.error("No response from server:", error.request);
        showToast("No se recibió respuesta del servidor.", "error");
      } else {
        console.error("Error inesperado:", error.message);
        showToast(`Error inesperado: ${error.message}`, "error");
      }
    }
  };

  const passwordMatch = () => {
    if (user.password === user.confirmPassword || user.confirmPassword === "" || user.password === "") { return true }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-stone-950 p-10" style={{ fontFamily: "Monserrat" }}>
      <img
        src="/circles.svg"
        alt="circles background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      <div className="relative z-10 flex lg:w-3/4 max-lg:flex-col ">
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

        <div className="w-full xl:w-1/2 bg-gray-200 opacity-90 px-10 py-10 flex flex-col justify-center rounded-3xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-black">
            {props.title}
          </h2>

          <form className="flex flex-col gap-2" onSubmit={registerNewUser}>
            {(
              [
                "name",
                "email",
                "phone",
                "address",
                "password",
                "confirmPassword",
              ] as const
            ).map((field) => (
              <div key={field}>
                <label className="block text-sm mb-1 text-gray-700">
                  {props[field]}
                </label>
                <div className="relative">
                  <input
                    type={
                      field === "password"
                        ? showPassword
                          ? "text"
                          : "password"
                        : field === "confirmPassword"
                          ? showConfirmPassword
                            ? "text"
                            : "password"
                          : "text"
                    }
                    value={user[field]}
                    onChange={(e) => {
                      setUser({ ...user, [field]: e.target.value });
                      if (field === "phone") validatePhone(e.target.value);
                      if (field === "name") validateName(e.target.value);
                    }}
                    className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
                  />
                  {/* Mostrar mensaje de error del nombre */}
                  {field === "name" && nameError && (
                    <p className="text-red-500 text-sm mt-1">{nameError}</p>
                  )}

                  {/* Mostrar mensaje de error del teléfono */}
                  {field === "phone" && phoneError && (
                    <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                  )}
                  {(field === "confirmPassword" || field === "password") && (
                    <button
                      type="button"
                      onClick={
                        field === "confirmPassword"
                          ? toggleConfirmPasswordVisibility
                          : togglePasswordVisibility
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >   <img
                        src={
                          field === "confirmPassword"
                            ? showConfirmPassword
                              ? "ojociego.svg"
                              : "ojoabierto.svg"
                            : showPassword
                              ? "ojociego.svg"
                              : "ojoabierto.svg"
                        }
                        alt={field === "confirmPassword" ? "Confirmar contraseña" : "Contraseña"}
                        className="w-6 h-6 transition-transform duration-200 hover:scale-110"
                      />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <p className='max-xl:text-sm text-red-600 animate-pulse max-md:text-xs max-[30rem]:text-[0.6rem]'>{passwordMatch() ? '' : "Password doesn't match"}</p>

            <button
              type="submit"
              className={`w-full py-2 mt-4 rounded-full text-white font-semibold ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-400 to-blue-400"
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
