import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { axiosRequest } from "../helpers/config";

interface CreatePublicationProps {
  title: string;
  description?: string;
  category?: string;
}

export default function CreatePublicationPage({
  title,
  description = "",
  category = "",
}: CreatePublicationProps) {
  const [desc, setDesc] = useState(description);
  const [cat, setCat] = useState(category);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categoryOptions = [
    "Digital Art",
    "Art",
    "Animation 3d",
    "Animation",
    "Sculture",
    "Painting",
    "Photography",
    "StreetArt",
    "Traditional",
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // Creamos la URL temporal para preview
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return alert("No estás logueado");

    const formData = new FormData();
    formData.append("description", desc);
    formData.append("category", cat);
    if (selectedImage) formData.append("image", selectedImage);

    try {
      setLoading(true);
      const res = await axiosRequest.post("/publications", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Publicación creada:", res.data);
      alert("Publicación creada correctamente");
      setDesc("");
      setCat("");
      setSelectedImage(null);
      setPreviewUrl(null); // Limpiamos el preview
    } catch (err: any) {
      console.error("Error al crear publicación:", err);
      alert("Error al crear publicación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-stone-950 p-8 overflow-hidden">
      <div className="relative z-10">
        <div className="mb-4 pl-4">
          <Link
            to="/Profile"
            className="font-bold bg-pink-400 hover:bg-pink-600 text-black rounded-full px-4 py-2.5"
          >
            ←
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-pink-500">{title}</h2>
        </div>

        <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-8">
          {/* Selector de imagen */}
         <div className="w-full bg-gray-700 rounded-lg flex items-center justify-center text-white cursor-pointer relative overflow-hidden">
  <label className="w-full flex items-center justify-center relative">
    {selectedImage && previewUrl ? (
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

          {/* Input de descripción */}
          <div className="w-full">
            <label className="text-gray-400 text-sm mb-1 block">Description</label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Add description"
              className="w-full bg-stone-800 text-gray-300 p-3 rounded-lg border border-stone-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Select de categoría */}
          <div className="w-full">
            <label className="text-gray-400 text-sm mb-1 block">Category</label>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="w-full bg-stone-800 text-gray-300 p-3 rounded-lg border border-stone-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
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

          {/* Botón de enviar */}
          <div className="w-full pb-20 pt-5">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-full font-semibold text-black bg-gradient-to-r from-pink-400 to-blue-400 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? "Creando..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
