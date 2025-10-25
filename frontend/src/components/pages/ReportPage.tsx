import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router"; 
import axios from "axios";

export default function ReportPage() {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://harixom-desarrollo.onrender.com/send-email",
        formData
      ); // URL del backend
      setSuccessMessage("¡Tu reporte ha sido enviado exitosamente!");
      setSuccessMessage("");
      setFormData({ name: "", email: "", message: "" }); // Limpia el formulario
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      setSuccessMessage(
        "Hubo un problema al enviar tu reporte. Inténtalo nuevamente."
      );
    }
  };

  return (
    <div className="bg-stone-900 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20">
      <h2 className="text-white text-2xl font-bold mb-4 text-center">Reportar un problema o sugerencia</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-300 mb-2">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-300 mb-2">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-300 mb-2">Mensaje</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows={5}
            required
          ></textarea>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
            onClick={() => navigate({ to: "/Landing" })}
          >
            Volver al Landing
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white"
          >
            Enviar
          </button>
        </div>
      </form>
      {successMessage && (
                <p className="text-center text-green-400 mt-4">
                  {successMessage}
                </p>
              )}
    </div>
  );
}