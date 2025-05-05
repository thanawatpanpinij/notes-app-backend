import { Router } from "express";
import { createAccount, login } from "../../../../controllers/mongo/auth.controller.js";

const router = Router();

// Register a new user
router.post("/register", createAccount);

router.post("/login", login);

export default router;
