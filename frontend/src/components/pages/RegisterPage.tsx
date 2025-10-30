import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import ReactFlagsSelect from "react-flags-select";
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
  const navigate = useNavigate();

  const [user, setUser] = useState<UserForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedIso, setSelectedIso] = useState("CR");
  const [selectedCode, setSelectedCode] = useState("+506");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);

  const phoneCodeMap: Record<string, string> = {
    CR: "+506", MX: "+52", ES: "+34", US: "+1", FR: "+33", DE: "+49", IT: "+39",
    AR: "+54", CO: "+57", CL: "+56", PE: "+51", VE: "+58", BR: "+55", CA: "+1",
    GB: "+44", JP: "+81", IN: "+91", CN: "+86", RU: "+7", AU: "+61", NZ: "+64"
  };

  const customLabels: Record<string, string> = {
    CR: "🇨🇷 Costa Rica (+506)", MX: "🇲🇽 México (+52)", ES: "🇪🇸 España (+34)", US: "🇺🇸 Estados Unidos (+1)",
    FR: "🇫🇷 Francia (+33)", DE: "🇩🇪 Alemania (+49)", IT: "🇮🇹 Italia (+39)", AR: "🇦🇷 Argentina (+54)",
    CO: "🇨🇴 Colombia (+57)", CL: "🇨🇱 Chile (+56)", PE: "🇵🇪 Perú (+51)", VE: "🇻🇪 Venezuela (+58)",
    BR: "🇧🇷 Brasil (+55)", CA: "🇨🇦 Canadá (+1)", GB: "🇬🇧 Reino Unido (+44)", JP: "🇯🇵 Japón (+81)",
    IN: "🇮🇳 India (+91)", CN: "🇨🇳 China (+86)", RU: "🇷🇺 Rusia (+7)", AU: "🇦🇺 Australia (+61)", NZ: "🇳🇿 Nueva Zelanda (+64)"
  };

  const validatePhone = (value: string) => {
    const regex = /^\+\d{1,4}\d{6,12}$/;
    if (value && !regex.test(value)) {
      setPhoneError("Ejemplo válido: +50612345678");
    } else {
      setPhoneError("");
    }
  };

  const registerNewUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const fullPhone = `${selectedCode}${user.phone}`;
    validatePhone(fullPhone);

    if (phoneError) {
      showToast("Corrige el número de teléfono.", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("phone", fullPhone);
    formData.append("address", user.address);
    formData.append("password", user.password);

    try {
      const response = await axiosRequest.post("user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast(response.data.message, "success");
      navigate({ to: "/Login" });
    } catch (error: any) {
      showToast("Error al registrar", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-stone-950" style={{ fontFamily: "Montserrat" }}>
      <img
        src="/circles.svg"
        alt="circles background"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      <div className="relative z-10 flex w-3/4 max-lg:flex-col">
        {/* Lado izquierdo: animación HARIXOM */}
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

        {/* Lado derecho: formulario */}
        <div className="w-full min-xl:w-1/2 bg-gray-200 opacity-90 p-5 px-15 flex flex-col justify-center rounded-3xl">
          <h2 className="text-2xl font-bold text-center mb-2 text-black">
            {props.title}
          </h2>

          <form className="flex flex-col gap-2" onSubmit={registerNewUser}>
            <div>
              <label className="block text-sm mb-1 text-gray-700">{props.name}</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">{props.email}</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
            </div>

      
              
            {/* Teléfono */}
            <div>
              <label>{props.phone}</label>
              <div className="flex gap-1 items-center">
                <ReactFlagsSelect
                  selected={selectedIso}
                  onSelect={(isoCode) => {
                    setSelectedIso(isoCode);
                    setSelectedCode(phoneCodeMap[isoCode] || "");
                  }}
                  searchable
                  showSelectedLabel
                  showOptionLabel
                  placeholder="País"
                  className="w-60"
                  customLabels={customLabels}
                />
                <input
                  type="tel"
                  value={user.phone}
                  onChange={(e) => {
                    setUser({ ...user, phone: e.target.value });
                    validatePhone(`${selectedCode}${e.target.value}`);
                  }}
                  placeholder="Número sin código"
                  className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
                />
              </div>
              {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            </div>

            {/* Dirección */}
            <div>
              <label>{props.address}</label>
              <input
                type="text"
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label>{props.password}</label>
              <input
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label>{props.confirmPassword}</label>
              <input
                type="password"
                value={user.confirmPassword}
                onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
            </div>

             <button
              type="submit"
              className={`w-full py-2 mt-4 rounded-full text-white font-semibold ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-pink-400 to-blue-400"
              }`}
              disabled={loading}
            >
              {loading ? "Registrando..." : "REGISTER"}
            </button>

            <div className="text-center text-sm mt-4">
              <p>{props.text}</p>
              <a href="/Login" className="ml-1 underline font-semibold hover:scale-105 duration-200">
                {props.link}
              </a>
            </div>
          </form>
        </div> 
      </div>  
    </section>
  );
}