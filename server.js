import express from "express";
import apiRoutes from "./routes/apiRoutes.route.js";
import database from "./config/database.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (request, response) => {
    response.end(
        "<body style='font-family:sans-serif;display:grid;place-items:center;'><div><p style='font-size:2rem;font-weight:bold;'>Wait a minute...Who are you?</p><img style='display:block; margin:0 auto;' src='https://media1.giphy.com/media/agmheddabICHK/200w.gif?cid=6c09b952r5mfsmdyq4oe9ahwv5imhwxtzoa8jpnhmxfix0b4&ep=v1_gifs_search&rid=200w.gif&ct=g'></div></body>"
    );
});

app.use("/api/v1/", apiRoutes(database));
app.use((error, request, response, next) => {
    const status = error.status;
    const stack = error.stack;
    const errorResponse = {
        status,
        isError: error.isError,
        message: error.message,
    };

    if (error.details) {
        errorResponse.details = error.details;
    }

    if (process.env.NODE_ENV === "development") {
        errorResponse.stack = stack;
    }

    console.error(stack);
    response.status(status).json(errorResponse);
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
