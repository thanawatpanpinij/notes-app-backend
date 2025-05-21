import { User } from "../models/User.model.js";

async function findAllUsers() {
  return await User.find();
}

async function findUserById(id) {
  return await User.findById(id);
}

async function findUserByIdAndDelete(userId) {
  return await User.findByIdAndDelete(userId);
}

const userService = {
  findAllUsers,
  findUserById,
  findUserByIdAndDelete,
};

export default userService;
