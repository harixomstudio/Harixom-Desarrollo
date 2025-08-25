import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { axiosRequest } from "../helpers/config";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  profile_picture?: string;
  banner_picture?: string;
}

export default function SetProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    profile_picture: "",
    banner_picture: "",
  });

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // Traer datos actuales del usuario
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    axiosRequest
      .get("/user", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setProfile(res.data.user))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "banner") => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "profile") setProfileFile(file);
      else setBannerFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          [type === "profile" ? "profile_picture" : "banner_picture"]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
  setLoading(true);
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("No estás logueado");
    setLoading(false);
    return;
  }

  const formData = new FormData();
  formData.append("name", profile.name);
  formData.append("email", profile.email);
  formData.append("phone", profile.phone);
  formData.append("address", profile.address);
  formData.append("description", profile.description || "");

  if (profileFile) {
    formData.append("profile_picture", profileFile);
    console.log("Archivo de perfil:", profileFile.name, profileFile.size, profileFile.type);
  } else {
    console.log("No hay archivo de perfil seleccionado");
  }

  if (bannerFile) {
    formData.append("banner_picture", bannerFile);
    console.log("Archivo de banner:", bannerFile.name, bannerFile.size, bannerFile.type);
  } else {
    console.log("No hay archivo de banner seleccionado");
  }

  console.log("FormData enviado:");
  formData.forEach((value, key) => {
    console.log(key, value);
  });

  try {
    const res = await axiosRequest.post("/user/profile?_method=PUT", formData, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  },
});

    console.log("Respuesta del backend:", res.data);

    alert("Perfil actualizado!");
    navigate({ to: "/Profile" });
  } catch (err: any) {
    // 👇 Aquí el log detallado
    if (err.response) {
      console.error("Error al actualizar perfil:", err.response.data);
    } else {
      console.error("Error inesperado:", err);
    }
    alert("Error al actualizar perfil");
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="flex flex-col min-h-screen items-center justify-start bg-stone-950 pt-10">
      {/* Banner */}
      <div className="relative w-full lg:w-3/4 h-50 rounded-xl overflow-hidden mb-6">
        <img
          src={profile.banner_picture || "https://cdn.pixabay.com/photo/2014/03/29/23/49/the-background-301145_1280.png"}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "banner")}
          className="hidden"
          id="banner-upload"
        />
        <label
          htmlFor="banner-upload"
          className="absolute right-4 bottom-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full cursor-pointer text-sm"
        >
          Cambiar Banner
        </label>
      </div>

      {/* Perfil */}
      <div className="flex flex-col items-center gap-4 w-full lg:w-3/4">
        <div className="relative">
          <img
            src={profile.profile_picture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
            alt="Perfil"
            className="w-32 h-32 rounded-full border-4 border-white object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "profile")}
            className="hidden"
            id="profile-upload"
          />
          <label
            htmlFor="profile-upload"
            className="absolute right-0 bottom-0 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-full cursor-pointer text-xs"
          >
            Cambiar Foto
          </label>
        </div>

        <form className="flex flex-col gap-4 w-full">
          <div>
            <label className="block text-sm mb-1 text-white">Nombre</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white">Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white">Dirección</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white">Descripción</label>
            <textarea
              name="description"
              value={profile.description ?? ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none text-white resize-none"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate({ to: "/Profile" })}
              className="px-6 py-2 rounded-full font-semibold text-white bg-gray-500 hover:bg-gray-600"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-400 to-blue-400"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
