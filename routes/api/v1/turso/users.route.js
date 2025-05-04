import express from "express";

const router = express.Router();

export default (database) => {
    router.get("/users", async (request, response, next) => {
        try {
            const { rows: users } = await database.execute("SELECT * FROM users;");
            response.send(users);
        } catch (error) {
            next(error);
        }
    });

    router.get("/users/:userId", async (request, response, next) => {
        try {
            const { userId } = request.params;
            const { rows: user } = await database.execute({
                sql: "SELECT * FROM users WHERE id = ?;",
                args: [userId],
            });

            if (user.length === 0) {
                const error = new Error("User not found");
                error.status = 404;
                return next(error);
            }
            response.send(user);
        } catch (error) {
            next(error);
        }
    });

    router.put("/users/:userId", async (request, response, next) => {
        try {
            const { userId } = request.params;
            const { name, email } = request.body;

            if (!name || !email) {
                const error = new Error("Name and email are required.");
                error.status = 400;
                return next(error);
            }

            const { rows: user } = await database.execute({
                sql: `
                    UPDATE users
                    SET name = ?, email = ?
                    WHERE id = ?`,
                args: [name, email, userId],
            });

            if (user.length === 0) {
                const error = new Error("User not found");
                error.status = 404;
                return next(error);
            }

            response.send({ message: "User information updated successfully" });
        } catch (error) {
            next(error);
        }
    });

    router.post("/users", async (request, response, next) => {
        const { name, email } = request.body;

        if (!name || !email) {
            const error = new Error("Name and email are required.");
            error.status = 400;
            return next(error);
        }

        const { lastInsertRowid: newUserId } = await database.execute({
            sql: "INSERT INTO users (name, email) VALUES (?, ?)",
            args: [name, email],
        });

        response.status(201).json({
            id: Number(newUserId),
            name,
            email,
        });
    });

    router.delete("/users/:userId", async (request, response, next) => {
        try {
            const { userId } = request.params;
            const { rows: user } = await database.execute({
                sql: "DELETE FROM users WHERE id = ?",
                args: [userId],
            });

            if (user.length === 0) {
                const error = new Error("User not found");
                error.status = 404;
                return next(error);
            }

            response.status(200).end("User deleted succesfully");
        } catch (error) {
            next(error);
        }
    });
    return router;
};
