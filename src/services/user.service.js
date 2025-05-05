import { User } from "../models/User.model.js";

async function findAllUsers() {
  return await User.find();
}

async function findUserByIdAndDelete(userId) {
  return await User.findByIdAndDelete(userId);
}

const userService = {
  findAllUsers,
  findUserByIdAndDelete,
};

export default userService;
