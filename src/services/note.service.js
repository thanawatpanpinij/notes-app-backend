import { Note } from "../models/Note.model.js";

async function findUserNotes(userId) {
  return await Note.find({ userId }).sort({ createdAt: -1, isPinned: -1 });
}

async function findUserNoteById(noteId) {
  return await Note.findById(noteId);
}

async function createNote(newNote) {
  return await Note.create(newNote);
}

async function searchNotes(user, query) {
  return await Note.find({
    userId: user._id,
    $or: [{ title: { $regex: new RegExp(query, "i") } }, { content: { $regex: new RegExp(query, "i") } }],
  });
}

async function findByIdAndDelete(noteId) {
  return await Note.findByIdAndDelete(noteId);
}

const notesService = {
  findUserNotes,
  findUserNoteById,
  createNote,
  searchNotes,
  findByIdAndDelete,
};

export default notesService;
