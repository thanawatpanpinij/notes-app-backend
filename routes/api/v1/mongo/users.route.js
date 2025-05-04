import { Router } from "express";
import { createUser, getAllUsers } from "./controllers/users.controller.js";
import { User } from "../../../../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

// get all users
router.get("/users", getAllUsers);

// create a user
router.post("/users", createUser);

// Register a new user
router.post("/auth/register", async (request, response) => {
    const { fullName, email, password } = request.body;

    if (!fullName || !email || !password) {
        return response.status(400).json({
            isError: true,
            message: "All fields are required.",
        });
    }

    try {
        const isExistingUser = await User.findOne({ email });
        if (isExistingUser) {
            return response.status(409).json({ error: true, message: "Email already in use." });
        }

        const user = new User({ fullName, email, password });
        await user.save();
    } catch (error) {
        response.status(500).json({
            isErrorrror: true,
            message: "Server Error",
            details: error.message,
        });
    }
    response.status(201).json({
        isError: false,
        message: "User registered succesfully!",
    });
});

router.post("/auth/login", async (request, response) => {
    const { email, password } = request.body;
    if (!email || !password) {
        return response.status(400).json({
            isError: true,
            message: "Email and password are required.",
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(401).json({
                isError: true,
                message: "Invalid credentials",
            });
        }

        const isMatched = bcrypt.compare(password, user.password);
        if (!isMatched) {
            return response.status(401).json({
                isError: true,
                message: "Invalid password",
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        response.json({
            isError: false,
            token,
            message: "Login successful!",
        });
    } catch (error) {
        response.status(500).json({
            isError: true,
            message: "Server error",
            details: error.message,
        });
    }
});

export default router;
