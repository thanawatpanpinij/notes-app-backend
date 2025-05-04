import { Router } from "express";
import { createNote, deleteNote, getAllNotes, updateNote } from "../../../../controllers/mongo/notes.controller.js";
import { Note } from "../../../../models/Note.model.js";
import authUser from "../../../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllNotes);

router.put("/:noteId", updateNote);

router.post("/", authUser, createNote);

router.delete("/:noteId", deleteNote);

router.post("/add-note", authUser, async (request, response) => {
  const { title, content, tags = [], isPinned = false } = request.body;
  const { user } = request.user;

  if (!title || !content) {
    return response.status(400).json({
      isError: false,
      message: "All fields required!",
    });
  }

  if (!user || !user._id) {
    return response.status(400).json({
      isError: true,

      message: "Invalid user credentials",
    });
  }

  try {
    const note = await Note.create({
      title,
      content,
      tags,
      isPinned,
      userId: user._id,
    });

    await note.save();
    response.json({
      isError: false,
      note,
      message: "Note added successfully!",
    });
  } catch (error) {
    response.status(500).json({
      isError: true,
      message: "Internal Server Error",
    });
  }
});

router.get("/get-all-notes", authUser, async (request, response) => {
  const { user } = request.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    response.json({
      isError: true,
      notes,
      message: "All notes retrieved",
    });
  } catch (error) {
    response.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.get("/search-notes", authUser, async (request, response) => {
  const { user } = request.user;
  const { query } = request.query;

  if (!query) {
    response.status(400)._construct({ isError: true, message: "Search query is required!" });
  }

  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [{ title: { $regex: new RegExp(query, "i") } }, { content: { $regex: new RegExp(query, "i") } }],
    });

    response.json({
      isError: false,
      notes: matchingNotes,
      message: "Notes matching the search query retrieved success!",
    });
  } catch (error) {
    response.status(500).json({
      isError: true,
      message: "Internal Server Error",
    });
  }
});

export default router;
