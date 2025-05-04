import express from "express";

const router = express.Router();

export default (database) => {
  router.get("/", async (request, response, next) => {
    try {
      const { rows: notes } = await database.execute("SELECT * FROM notes");
      response.send(notes);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:noteId", async (request, response, next) => {
    try {
      const { noteId } = request.params;
      const { rows: note } = await database.execute({
        sql: "SELECT * FROM notes WHERE id = ?",
        args: [noteId],
      });

      if (!note) {
        const error = new Error("Note not found");
        error.status = 404;
        return next(error);
      }

      response.send(note);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (request, response) => {
    const { title, content, tags = [], is_pinned = false, user_id } = request.body;

    if (!user_id) {
      const error = new Error("User Id is required");
      error.status = 400;
      next(error);
    }

    const result = await database.execute({
      sql: `
                INSERT INTO notes (title, content, tags, is_pinned, user_id)
                VALUES (?, ?, ?, ?, ?)
            `,
      args: [title, content, JSON.stringify(tags), is_pinned ? 1 : 0, user_id],
    });

    response.status(201).json({
      id: Number(result.lastInsertRowid),
      title,
      content,
      tags,
      is_pinned,
      user_id,
    });
  });

  return router;
};
