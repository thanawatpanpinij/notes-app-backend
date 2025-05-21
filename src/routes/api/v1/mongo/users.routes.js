import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getCurrentUser,
} from "../../../../controllers/mongo/users.controller.js";
import authUser from "../../../../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authUser, getCurrentUser);

// get all users
router.get("/", authUser, getAllUsers);

router.delete("/:userId", authUser, deleteUser);

export default router;
