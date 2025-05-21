import mongoose from "mongoose";
import userService from "../../services/user.service.js";

async function getCurrentUser(request, response, next) {
  try {
    const { _id } = request.user;
    const user = await userService.findUserById(_id);
    if (!user) {
      return response
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    response.json({
      success: true,
      message: "Retrived current user successfully",
      user,
    });
  } catch (error) {
    const customError = new Error("Server Error");
    customError.status = 500;
    customError.success = false;
    customError.details = error.message;
    next(customError);
  }
}

async function getAllUsers(request, response, next) {
  const user = request.user;

  if (user.role !== "admin") {
    return response
      .status(403)
      .json({ success: false, message: "Access denied. No permission." });
  }

  try {
    const users = await userService.findAllUsers();
    response.json({ success: true, users });
  } catch (error) {
    const customError = new Error("Failed to fetch users");
    customError.status = 500;
    customError.success = false;
    customError.details = error.message;
    next(customError);
  }
}

async function deleteUser(request, response, next) {
  const user = request.user;
  const { userId } = request.params;

  if (user.role !== "admin") {
    return response
      .status(403)
      .json({ success: false, message: "Access denied. No permission." });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return response
      .status(404)
      .json({ success: false, message: "Invalid user id" });
  }

  try {
    const user = await userService.findUserByIdAndDelete(userId);
    if (!user) {
      return response
        .status(404)
        .json({ success: false, message: `User with id ${userId} not found` });
    }
    response.json({
      success: true,
      message: `User with id ${userId} deleted successfully.`,
    });
  } catch (error) {
    const customError = new Error("Failed to fetch users");
    customError.status = 500;
    customError.success = false;
    customError.details = error.message;
    next(customError);
  }
}

export { getCurrentUser, getAllUsers, deleteUser };
