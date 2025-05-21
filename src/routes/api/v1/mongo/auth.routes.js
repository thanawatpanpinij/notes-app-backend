import { Router } from "express";
import {
  createAccount,
  login,
  logout,
} from "../../../../controllers/mongo/auth.controller.js";

const router = Router();

// Register a new user
router.post("/register", createAccount);

router.post("/login", login);

router.post("/logout", logout);

export default router;
