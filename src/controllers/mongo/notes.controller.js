import mongoose from "mongoose";
import { Note } from "../../models/Note.model.js";
import noteService from "../../services/note.service.js";
import { User } from "../../models/User.model.js";
import userService from "../../services/user.service.js";

async function getAllUserNotes(request, response, next) {
  try {
    const user = request.user;
    const { query } = request.query;
    const isUserExisting = await User.findById(user._id);
    if (!isUserExisting) {
      return response
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (query) {
      const matchingNotes = await noteService.searchNotes(user, query);
      return response.json({
        success: true,
        notes: matchingNotes,
        message: "Notes matching the search query retrieved success!",
      });
    }

    const notes = await noteService.findUserNotes(user._id);
    response.json({ success: true, message: "All notes retrieved", notes });
  } catch (error) {
    const customError = new Error("Failed to fetch all notes");
    customError.status = 500;
    customError.success = false;
    customError.details = error.message;
    next(customError);
  }
}

async function getUserNote(request, response, next) {
  try {
    const user = request.user;
    const { noteId } = request.params;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return response
        .status(404)
        .json({ success: false, message: "Invalid note id" });
    }
    const note = await noteService.findUserNoteById(noteId);
    if (!note) {
      return response
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    response.json({
      success: true,
      note,
      message: `Note with id ${noteId} retreived`,
    });
  } catch (error) {
    const customError = new Error("Failed to delete a note");
    customError.status = 500;
    customError.success = false;
    customError.details = error.message;
    next(customError);
  }
}

async function updateNote(request, response, next) {
  try {
    const { noteId } = request.params;
    const note = request.body;
    const user = request.user;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      const error = new Error("Note not found");
      error.status = 404;
      error.success = false;
      return next(error);
    }
    const isUserExisting = await userService.findUserById(user._id);
    if (!isUserExisting) {
      return response
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const updatedNote = await Note.findByIdAndUpdate(noteId, note, {
      new: true,
    });
    response.json({ success: true, note: updatedNote });
  } catch (error) {
    const customError = new Error("Failed to update a note");
    customError.status = 500;
    customError.success = false;
    customError.details = error.message;
    next(customError);
  }
}

async function createNote(request, response, next) {
  try {
    const { title, content, tags = [], isPinned = false } = request.body;
    const user = request.user;

    if (!user || !user._id) {
      return response.status(401).json({
        success: false,
        message: "Please Log in first",
      });
    }

    if (!title || !content) {
      return response.status(400).json({
        success: false,
        message: "All fields required!",
      });
    }
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
  try {
    const { noteId } = request.params;
    const { _id } = request.user;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      const error = new Error("Invalid note id");
      error.status = 404;
      error.success = false;
      return next(error);
    }
    const user = await userService.findUserById(_id);
    if (!user) {
      return response
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const note = await noteService.findByIdAndDelete(noteId);
    if (!note) {
      return response
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    response.status(200).json({
      success: true,
      message: `Note with id: ${noteId} deleted succesfully`,
    });
  } catch (error) {
    const customError = new Error("Failed to delete a note");
    customError.status = 500;
    customError.success = false;
    customError.details = error.message;
    next(customError);
  }
}

export { getAllUserNotes, getUserNote, createNote, updateNote, deleteNote };
