import { Router } from "express";
import { createUser, getAllUsers } from "../../../../controllers/mongo/users.controller.js";

const router = Router();

// get all users
router.get("/", getAllUsers);

// create a user
router.post("/", createUser);

export default router;
