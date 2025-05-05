import { Router } from "express";
import { createNote, deleteNote, getAllUserNotes, getUserNote, updateNote } from "../../../../controllers/mongo/notes.controller.js";
import authUser from "../../../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authUser, getAllUserNotes);

router.get("/:noteId", authUser, getUserNote);

router.put("/:noteId", authUser, updateNote);

router.post("/", authUser, createNote);

router.delete("/:noteId", authUser, deleteNote);

export default router;
