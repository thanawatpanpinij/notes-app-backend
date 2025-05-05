import { User } from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function findUserEmail(email) {
  return await User.findOne(email);
}

async function createUser(newUser) {
  return await User.create(newUser);
}

function checkPassword(password, userPassword) {
  return bcrypt.compare(password, userPassword);
}

function signToken(payload, options = {}) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
    ...options,
  });
}

const authService = {
  findUserEmail,
  createUser,
  checkPassword,
  signToken,
};

export default authService;
