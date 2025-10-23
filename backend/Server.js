import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configura el transporte de correo
const transporter = nodemailer.createTransport({
  service: "gmail", // Usa Gmail como servicio de correo
  auth: {
    user: "harixomstudio@gmail.com", // Tu correo
    pass: "tpmz gwko nqhp xwno", // Contraseña del correo (usa una contraseña de aplicación si usas Gmail)
  },
});

// Endpoint para enviar correos
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: "harixomstudio@gmail.com", // Destinatario
    subject: `Reporte de ${name}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Correo enviado exitosamente.");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).send("Error al enviar el correo.");
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});