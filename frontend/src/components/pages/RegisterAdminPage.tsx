import type React from "react";
import { Link } from "@tanstack/react-router";

interface RegisterProps {
  title: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
  link: string;
  buttonRegister?: React.ReactNode;
}

export default function Register(props: RegisterProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-black" style={{ fontFamily: "Montserrat" }}>
      {/* Header */}
      <h1 className=" mt-15 absolute top-1 text-center text-pink-400 font-semibold text-2xl">
        User registration for admins
      </h1>

      {/* Form Container */}
      <div className="w-full max-w-md bg-gray-200 rounded-xl p-15 shadow-lg mt-40 mb-30">
        <h2 className="text-center text-2xl font-bold text-black mb-6">
          New user
        </h2>

        <form className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-black">{props.name}</label>
            <input
              type="text"
              className="w-full px-3 py-2 border-b border-gray-500 bg-transparent text-black focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-black">{props.email}</label>
            <input
              type="email"
              className="w-full px-3 py-2 border-b border-gray-500 bg-transparent text-black focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-black">{props.phone}</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border-b border-gray-500 bg-transparent text-black focus:outline-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm text-black">{props.address}</label>
            <input
              type="text"
              className="w-full px-3 py-2 border-b border-gray-500 bg-transparent text-black focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-black">{props.password}</label>
            <input
              type="password"
              className="w-full px-3 py-2 border-b border-gray-500 bg-transparent text-black focus:outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-black">
              {props.confirmPassword}
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border-b border-gray-500 bg-transparent text-black focus:outline-none"
            />
          </div>

          {/* Buttons */}
          {props.buttonRegister ? (
            props.buttonRegister
          ) : (
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="flex-1 py-2 rounded-full bg-green-400 text-black font-semibold hover:scale-105 duration-200"
              >
                Create user
              </button>
            </div>
          )}

          <div className="flex justify-center mt-2 text-sm">
            <Link
              to="/Landing"
              className="flex-1 py-2 rounded-full bg-red-400 text-black font-semibold hover:scale-105 duration-200 text-center"
            >
              {props.link}
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
