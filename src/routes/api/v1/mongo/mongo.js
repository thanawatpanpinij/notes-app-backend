import { Router } from "express";
import notesRouter from "./notes.routes.js";
import usersRouter from "./users.routes.js";
import authRouter from "./auth.routes.js";

const router = Router();

router.use("/notes", notesRouter);
router.use("/users", usersRouter);
router.use("/auth", authRouter);

export default router;
