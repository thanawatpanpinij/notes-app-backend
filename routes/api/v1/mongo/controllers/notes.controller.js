import mongoose from "mongoose";
import { Note } from "../../../../../models/Note.model.js";

async function getAllNotes(request, response, next) {
    try {
        const notes = await Note.find().sort({ createdAt: -1, isPinned: -1 });
        response.json(notes);
    } catch (error) {
        const customError = new Error("Failed to fetch all notes");
        customError.status = 500;
        customError.isError = true;
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
        error.isError = true;
        return next(error);
    }

    try {
        const updatedNote = await Note.findByIdAndUpdate(noteId, note, { new: true });
        response.send(updatedNote);
    } catch (error) {
        const customError = new Error("Failed to update a note");
        customError.status = 500;
        customError.isError = true;
        customError.details = error.message;
        next(customError);
    }
}

async function createNote(request, response, next) {
    const { title, content, tags = [], isPinned = false, userId } = request.body;

    try {
        const note = await Note.create({
            title,
            content,
            tags,
            isPinned,
            userId,
        });
        response.status(201).json(note);
    } catch (error) {
        const customError = new Error("Failed to create a note");
        customError.status = 500;
        customError.isError = true;
        customError.details = error.message;
        next(customError);
    }
}

async function deleteNote(request, response, next) {
    const { noteId } = request.params;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        const error = new Error("Note not found");
        error.status = 404;
        error.isError = true;
        return next(error);
    }

    try {
        await Note.deleteOne({ _id: noteId });
        response.status(200).send(`Note with id: ${noteId} deleted succesfully`);
    } catch (error) {
        const customError = new Error("Failed to delete a note");
        customError.status = 500;
        customError.isError = true;
        customError.details = error.message;
        next(customError);
    }
}

export { getAllNotes, createNote, updateNote, deleteNote };
