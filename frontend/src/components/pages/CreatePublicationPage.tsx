import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useToast } from "../ui/Toast";
import { axiosRequest } from "../helpers/config";

interface UserSuggestion {
  id: number;
  display: string;
  picture?: string;
}

export default function CreatePublicationPage({ title }: { title: string }) {
  const [desc, setDesc] = useState<string>("");
  const [cat, setCat] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userSuggestions, setUserSuggestions] = useState<UserSuggestion[]>([]);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  const fetchSuggestions = async (query: string) => {
    const cleanQuery = query.replace(/^@/, "").trim();
    if (!cleanQuery) return [];

    try {
      const { data } = await axiosRequest.get(`/search?q=${cleanQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData: UserSuggestion[] = data.users.map((user: any) => ({
        id: user.id,
        display: `@${user.name}`,
        picture: user.profile_picture ?? "",
      }));

      setUserSuggestions(userData);
      return userData;
    } catch (error) {
      console.error("Error buscando sugerencias:", error);
      setUserSuggestions([]);
      return [];
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const maxSize = 3 * 1024 * 1024;
      if (file.size > maxSize) {
        showToast("La imagen no puede superar los 3 MB.", "error");
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 📨 Enviar publicación
  const handleSubmit = async () => {
    if (!token) return showToast("No estás logueado", "error");

    const formData = new FormData();
    formData.append("description", desc);
    formData.append("category", cat);
    if (selectedImage) formData.append("image", selectedImage);

    try {
      setLoading(true);
      await axiosRequest.post("/publications", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      showToast("Publicación creada correctamente", "success");
      setDesc("");
      setCat("");
      setSelectedImage(null);
      setPreviewUrl(null);
      navigate({ to: "/Feed" });
    } catch (err: any) {
  console.log("Error al crear publicación:", err);

  if (err.response && err.response.data) {
    // Si Laravel envía errores de validación
    if (err.response.data.errors) {
      const firstError = Object.values(err.response.data.errors)[0] as string[];
      showToast(firstError[0], "error");
    } 
    // Si Laravel envía un mensaje de error general (como en Cloudinary)
    else if (err.response.data.details) {
      showToast(err.response.data.details, "error");
    } 
    // Si hay mensaje genérico
    else if (err.response.data.error) {
      showToast(err.response.data.error, "error");
    } 
    else if (err.response.data.message) {
      showToast(err.response.data.message, "error");
    } 
    else {
      showToast("Error desconocido al crear publicación.", "error");
    }
  } else {
    showToast("Error al conectar con el servidor.", "error");
  }
}
  };

  const categoryOptions = [
    "Digital Art",
    "Animation",
    "Sculpture",
    "Traditional",
    "3D Art",
    "Street Art",
    "Photography",
  ];

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDesc(e.target.value);

    // Detectar última mención o hashtag
    const atMatch = e.target.value.match(/@(\w*)$/);
    const hashMatch = e.target.value.match(/#(\w*)$/);

    if (atMatch) {
      fetchSuggestions(atMatch[1]); // usuarios
    } else if (hashMatch) {
      const tag = hashMatch[1];
      // Por ahora solo mostramos #RetoHarixom
      if ("RetoHarixom".toLowerCase().startsWith(tag.toLowerCase())) {
        setUserSuggestions([{ id: 0, display: "#RetoHarixom" }]);
      } else {
        setUserSuggestions([]);
      }
    } else {
      setUserSuggestions([]);
    }
  };

  return (
    <section className="min-h-screen bg-stone-950 p-10 "style={{ fontFamily: "Montserrat" }}>
      <img
        src="/circles.svg"
        alt="circles background"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div>

        <div className="mb-10 pl-4">
          <Link
            to="/Profile"
            className="font-extrabold text-2xl bg-pink-400 hover:bg-pink-600 text-black rounded-full px-4 py-3"
          >
            ←
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center relative">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-pink-400">{title}</h2>
          </div>

          <div className="w-full max-w-xl flex flex-col gap-8 relative">
            {/* 📸 Imagen */}
            <div className="w-full bg-gray-400 rounded-lg flex items-center justify-center text-white cursor-pointer relative overflow-hidden">
              <label className="w-full flex items-center justify-center relative">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-[400px] object-contain rounded-lg"
                  />
                ) : (
                  <span className="p-4">Select Image</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>

            {/* 📝 Descripción con @ y sugerencias */}
            <div className="w-full relative">
              <label className="text-gray-400 text-sm mb-1 block">Description</label>
              <textarea
                value={desc}
                onChange={handleDescChange}
                placeholder="Add description with @user or #tag"
                className="w-full bg-stone-900 text-gray-300 p-3 rounded-lg border-b-2 border-stone-700"
              />
              {userSuggestions.length > 0 && (
                <div className="absolute bg-stone-800 text-white rounded-md mt-1 w-full z-10 max-h-60 overflow-auto shadow-lg">
                  {userSuggestions.map((user) => (
                    <div
                      key={user.id}
                      className="p-2 hover:bg-stone-700 cursor-pointer"
                      onClick={() => {
                        const lastAt = desc.lastIndexOf("@");
                        const lastHash = desc.lastIndexOf("#");
                        const lastIndex = Math.max(lastAt, lastHash);

                        if (lastIndex !== -1) {
                          const newDesc = desc.substring(0, lastIndex) + user.display + " ";
                          setDesc(newDesc);
                          setUserSuggestions([]);
                        }
                      }}
                    >
                      {user.display}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 🎨 Categoría */}
            <div className="w-full">
              <label className="text-gray-400 text-sm mb-1 block">Category</label>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full bg-stone-900 text-gray-300 p-3 rounded-lg border-b-2 border-stone-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="" disabled>
                  Select category
                </option>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* 🚀 Botón */}
            <div className="w-full pb-20 pt-5">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !selectedImage || !cat} // <-- Aquí
                className={`w-full py-3 rounded-full font-semibold text-black 
      bg-gradient-to-r from-pink-400 to-blue-300 hover:scale-102 transition-transform duration-500 
      ${loading || !selectedImage || !cat ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Creando..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
