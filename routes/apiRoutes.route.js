import express from "express";
import usersRoute from "./api/v1/turso/users.route.js";
import mongoUsers from "./api/v1/mongo/users.route.js";
import notesRoute from "./api/v1/turso/notes.route.js";
import mongoNotes from "./api/v1/mongo/notes.route.js";

const router = express.Router();

export default (database) => {
    router.use("/turso", usersRoute(database));
    router.use("/turso", notesRoute(database));
    router.use("/mongo", mongoUsers);
    router.use("/mongo", mongoNotes);
    return router;
};
