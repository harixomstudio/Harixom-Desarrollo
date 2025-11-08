import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { axiosRequest } from "../helpers/config";
import { useToast } from "../ui/Toast";

export default function TallerCreatePage({ title }: { title: string }) {
  const [mode, setMode] = useState("");
  const [titleWorkshop, setTitleWorkshop] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");
  const [duration, setDuration] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [contributor, setContributor] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
  const checkPremium = async () => {
    try {
      const { data } = await axiosRequest.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = data.user ?? data; 
      if (!user.is_premium) {
        showToast("Solo usuarios premium pueden crear eventos.", "error");
        navigate({ to: "/Suscriptions" });
      }
    } catch (err) {
      console.error("Error verificando usuario:", err);
      showToast("Error al verificar usuario.", "error");
    }
  };
  checkPremium();
}, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > 3 * 1024 * 1024)
        return showToast("La imagen no puede superar los 3 MB.", "error");
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!token) return showToast("No estás logueado", "error");

    const formData = new FormData();
    formData.append("mode", mode);
    formData.append("title", titleWorkshop);
    formData.append("description", description);
    formData.append("place", place);
    formData.append("duration", duration);
    formData.append("dateStart", dateStart);
    formData.append("timeStart", timeStart);
    if (contributor) formData.append("contributor", contributor);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      await axiosRequest.post(`http://127.0.0.1:8000/api/workshops/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      showToast("Taller creado correctamente.", "success");
      navigate({ to: "/Workshops" });
    } catch (err) {
      console.error(err);
      showToast("Error al crear el taller.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-stone-950 p-10 bg-[url('/circles.svg')] "
    style={{ fontFamily: "Montserrat" }}>
      <div className="mb-10 pl-4">
        <Link
          to="/Workshops"
          className="font-bold bg-pink-400 hover:bg-pink-600 text-black rounded-full px-4 py-2.5"
        >
          ←
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-pink-400 mb-8">{title}</h2>

        <div className="w-full max-w-xl flex flex-col gap-6">
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

          <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full bg-stone-950 text-gray-300 p-3 rounded-lg border-b-2 border-stone-700 appearance-none"
        >
          <option value="">Select a Mode</option>
          <option value="Virtual">Virtual</option>
          <option value="Presential">Presential</option>
        </select>
          <input
            type="text"
            placeholder="Title"
            value={titleWorkshop}
            onChange={(e) => setTitleWorkshop(e.target.value)}
            className="w-full bg-stone-950 text-gray-300 p-3 rounded-lg border-b-2 border-stone-700"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-stone-950 text-gray-300 p-3 rounded-lg border-b-2 border-stone-700"
          />
          <input
            type="text"
            placeholder="Place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="w-full bg-stone-950 text-gray-300 p-3 rounded-lg border-b-2 border-stone-700"
          />
          <input
            type="text"
            placeholder="Duration (opcional)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-stone-950 text-gray-300 p-3 rounded-lg border-b-2 border-stone-700"
          />
          <div className="flex gap-4">
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="flex-1 bg-stone-950 text-gray-300 p-3 rounded-lg border-b-2 border-stone-700"
            />
            <input
              type="time"
              value={timeStart}
              onChange={(e) => setTimeStart(e.target.value)}
              className="flex-1 bg-stone-950 text-gray-300 p-3 rounded-lg border-b-2 border-stone-700"
            />
          </div>
          <input
            type="text"
            placeholder="Contributor (opcional)"
            value={contributor}
            onChange={(e) => setContributor(e.target.value)}
            className="w-full bg-stone-950 text-gray-300 p-3 rounded-lg border-b-2 border-stone-700"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 mt-4 rounded-full font-semibold text-black bg-gradient-to-r from-pink-400 to-blue-300 hover:shadow-lg disabled:opacity-50"
          >
            {loading ? "Creando..." : "Create Workshop"}
          </button>
        </div>
      </div>
    </section>
  );
}