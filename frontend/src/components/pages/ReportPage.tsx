import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";

export default function ReportPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "Report", // Valor inicial del select
    email: "", // Este será llenado automáticamente con el correo del usuario logueado
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  // Obtén el correo del usuario logueado al cargar la página
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const token = localStorage.getItem("access_token"); // Obtén el token del usuario logueado
        if (!token) {
          console.error("No se encontró el token de autenticación.");
          return;
        }

        // Solicita los datos del usuario al backend
        const { data } = await axios.get("https://harixom-desarrollo.onrender.com/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Actualiza el estado con el correo del usuario
        setFormData((prev) => ({ ...prev, email: data.user.email }));
      } catch (error) {
        console.error("Error al obtener el correo del usuario:", error);
      }
    };

    fetchUserEmail();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", formData); // Verifica los datos aquí

    try {
      await axios.post(
        "https://harixom-desarrollo.onrender.com/api/email/report",
        formData
      );
      setSuccessMessage("¡Tu reporte ha sido enviado exitosamente!");
      setFormData({ name: "Report", email: formData.email, message: "" });

      // Elimina el mensaje después de 5 segundos
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error: any) {
      if (error.response?.status === 422) {
        // Captura los errores de validación específicos
        const validationErrors = error.response.data.errors;
        if (validationErrors?.message) {
          setSuccessMessage(validationErrors.message[0]); // Muestra el error del campo "message"
        } else {
          setSuccessMessage("Mensaje muy corto, por favor sea más específico.");
        }
      } else {
        console.error("Error al enviar el correo:", error.response?.data || error.message);
        setSuccessMessage("Hubo un problema al enviar tu reporte. Inténtalo nuevamente.");
      }

      // Elimina el mensaje después de 5 segundos
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }
  };

  return (
    <div className="bg-stone-900 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20" style={{ fontFamily: "Montserrat" }}>
      <h2 className="text-white text-2xl font-bold mb-4 text-center">Reports</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-300 mb-2">Report Name</label>
          <select
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          >
            <option value="Report">Report</option>
            <option value="Suggestion">Suggestion</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            disabled // El campo está deshabilitado porque el correo se obtiene automáticamente
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-300 mb-2">Message</label>
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
            Go to Home
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white"
          >
            Send
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