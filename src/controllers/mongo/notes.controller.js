import mongoose from "mongoose";
import { Note } from "../../models/Note.model.js";
import noteService from "../../services/note.service.js";

async function getAllUserNotes(request, response, next) {
  const { user } = request.user;
  const { query } = request.query;

  if (!user) {
    return response.status(401).json({ success: false, message: "Unauthorized - no user ID found" });
  }

  try {
    if (query) {
      const matchingNotes = await noteService.searchNotes(user, query);
      return response.json({ success: true, notes: matchingNotes, message: "Notes matching the search query retrieved success!" });
    }

    const notes = await noteService.findUserNotes(user._id);
    response.json({ success: true, notes, message: "All notes retrieved" });
  } catch (error) {
    const customError = new Error("Failed to fetch all notes");
    customError.status = 500;
    customError.success = false;
    customError.details = error.message;
    next(customError);
  }
}

async function getUserNote(request, response, next) {
  const { user } = request.user;
  const { noteId } = request.params;

  if (!user) {
    return response.status(401).json({ success: false, message: "Unauthorized - no user ID found" });
  }

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return response.status(404).json({ success: false, message: "Invalid note id" });
  }

  try {
    const note = await noteService.findUserNoteById(noteId);
    if (!note) {
      return response.status(404).json({ success: false, message: "Note not found" });
    }
    response.json({ success: true, note, message: `Note with id ${noteId} retreived` });
  } catch (error) {
    const customError = new Error("Failed to delete a note");
    customError.status = 500;
    customError.success = false;
    customError.details = error.message;
    next(customError);
  }
}

async function updateNote(request, response, next) {
  const { noteId } = request.params;
  const note = request.body;

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    const error = new Error("Note not found");
    error.status = 404;
    error.success = false;
    return next(error);
  }

  try {
    const updatedNote = await Note.findByIdAndUpdate(noteId, note, { new: true });
    response.send(updatedNote);
  } catch (error) {
    const customError = new Error("Failed to update a note");
    customError.status = 500;
    customError.success = false;
    customError.details = error.message;
    next(customError);
  }
}

async function createNote(request, response, next) {
  const { title, content, tags = [], isPinned = false } = request.body;
  const { user } = request.user;

  if (!user || !user._id) {
    return response.status(401).json({
      success: false,
      message: "Unauthorized - Invalid user credentials",
    });
  }

  if (!title || !content) {
    return response.status(400).json({
      success: false,
      message: "All fields required!",
    });
  }

  try {
    const note = await noteService.createNote({
      title,
      content,
      tags,
      isPinned,
      userId: user._id,
    });

    response.json({
      success: true,
      note,
      message: "Note added successfully!",
    });
  } catch (error) {
    const customError = new Error("Failed to create a note");
    customError.status = 500;
    customError.success = false;
    customError.details = error.message;
    next(customError);
  }
}

async function deleteNote(request, response, next) {
  const { noteId } = request.params;
  const { user } = request.user;

  if (!user) {
    return response.status(401).json({
      success: false,
      message: "Unauthorized - Invalid user credentials",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    const error = new Error("Invalid note id");
    error.status = 404;
    error.success = false;
    return next(error);
  }

  try {
    const note = await noteService.findByIdAndDelete(noteId);
    if (!note) {
      return response.status(404).json({ success: false, message: "Note not found" });
    }

    response.status(200).json({ success: true, message: `Note with id: ${noteId} deleted succesfully` });
  } catch (error) {
    const customError = new Error("Failed to delete a note");
    customError.status = 500;
    customError.success = false;
    customError.details = error.message;
    next(customError);
  }
}

export { getAllUserNotes, getUserNote, createNote, updateNote, deleteNote };
