import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(xss());
app.use(hpp());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: "Demasiadas solicitudes, intenta más tarde.",
});
app.use(limiter);

app.get("/", async (req, res) => {
  try {
    const date = new Date().toISOString();
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; 
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();

    res.json({
      time: date,
      country: data.country || "Desconocido",
      countryCode: data.countryCode || "N/A",
      city: data.city || "Desconocida",
      ip: ip || "No disponible"
    });
  } catch (error) {
    console.error("Error obteniendo el país:", error);
    res.status(500).json({ message: "Error obteniendo la información del país." });
  }
});

app.use((err, req, res, next) => {
  console.error("Error en el servidor:", err);
  res.status(500).json({ message: "Ocurrió un error en el servidor." });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
