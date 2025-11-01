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

  const [selectedCountry, setSelectedCountry] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const phoneCodeMap: Record<string, string> = {
    CR: "+506", MX: "+52", ES: "+34", US: "+1", FR: "+33", DE: "+49", IT: "+39",
    AR: "+54", CO: "+57", CL: "+56", PE: "+51", VE: "+58", BR: "+55", CA: "+1",
    GB: "+44", JP: "+81", IN: "+91", CN: "+86", RU: "+7", AU: "+61", NZ: "+64"
  };

  const customLabels: Record<string, string> = {
    CR: "Costa Rica", MX: "México", ES: "España", US: "Estados Unidos",
    FR: "Francia", DE: "Alemania", IT: "Italia", AR: "Argentina",
    CO: "Colombia", CL: "Chile", PE: "Perú", VE: "Venezuela",
    BR: "Brasil", CA: "Canadá", GB: "Reino Unido)", JP: "Japón",
    IN: "India", CN: "China", RU: "Rusia", AU: "Australia", NZ: "Nueva Zelanda"
  };

  const registerNewUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const phoneCode = phoneCodeMap[selectedCountry] || "";
    const fullPhone = `${phoneCode}${user.phone}`;

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
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        showToast("Please fix the highlighted errors.", "error");
      } else {
        showToast("Error al registrar", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-stone-950">
      <div className="relative z-10 flex w-3/4 max-lg:flex-col">
        {/* Lado derecho del formulario */}
        <div className="w-full bg-gray-200 opacity-90 p-5 flex flex-col justify-center rounded-3xl">
          <h2 className="text-2xl font-bold text-center mb-2 text-black">
            {props.title}
          </h2>

          <form className="flex flex-col gap-2" onSubmit={registerNewUser}>
            {/* Nombre */}
            <div>
              <label>{props.name}</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
            </div>

            {/* Email */}
            <div>
              <label>{props.email}</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <label>{props.phone}</label>
              <div className="flex gap-1 items-center">
                <ReactFlagsSelect
                  selected={selectedCountry}
                  onSelect={(countryCode) => setSelectedCountry(countryCode)}
                  searchable
                  showSelectedLabel
                  showOptionLabel
                  placeholder="País"
                  className="w-60"
                />
                <input
                  type="tel"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  placeholder="Número sin código"
                  className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>}
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
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address[0]}</p>}
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
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
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
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-400 to-blue-400"
              }`}
              disabled={loading}
            >
              {loading ? "Registrando..." : "REGISTER"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}