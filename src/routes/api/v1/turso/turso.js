import { Router } from "express";
import notesRouter from "./notes.routes.js";
import usersRouter from "./users.routes.js";

const router = Router();

export default (database) => {
  router.use("/notes", notesRouter(database));
  router.use("/users", usersRouter(database));
  return router;
};
