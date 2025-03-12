import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

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

app.get("/", (req, res) => {
  const date = new Date().toISOString();
  res.json({ time: date });
});

app.use((err, req, res, next) => {
  console.error("Error en el servidor:", err);
  res.status(500).json({ message: "Ocurrió un error en el servidor." });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
