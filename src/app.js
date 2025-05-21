import express from "express";
import apiRouter from "./routes/index.js";
import { database } from "./config/database.js";
import errorHandling from "./middlewares/error.middleware.js";
import helmet from "helmet";
import cors from "cors";
import limiter from "./middlewares/rateLimiter.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet());
const corsOptions = {
  origin: ["http://localhost:5173", "https://notura-app-frontend.vercel.app/"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json());
app.use(cookieParser());

app.get("/", (request, response) => {
  response.end(
    "<body style='font-family:sans-serif;display:grid;place-items:center;'><div><p style='font-size:2rem;font-weight:bold;'>Wait a minute...Who are you?</p><img style='display:block; margin:0 auto;' src='https://media1.giphy.com/media/agmheddabICHK/200w.gif?cid=6c09b952r5mfsmdyq4oe9ahwv5imhwxtzoa8jpnhmxfix0b4&ep=v1_gifs_search&rid=200w.gif&ct=g'></div></body>"
  );
});

app.use("/api/v1/", apiRouter(database));

app.use(errorHandling);

export default app;
