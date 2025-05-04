import { User } from "../../models/User.model.js";

async function getAllUsers(request, response, next) {
  try {
    const users = await User.find();
    response.json({ isError: false, users });
  } catch (error) {
    const customError = new Error("Failed to fetch users");
    customError.status = 500;
    customError.isError = true;
    customError.details = error.message;
    next(customError);
  }
}

async function createUser(request, response, next) {
  const { name, email } = request.body;
  try {
    // prevent duplicate email
    const isExisting = await User.findOne({ email });
    if (isExisting) {
      const error = new Error("Email already in use!");
      error.status = 409;
      error.isError = true;
      return next(error);
    }
    // create and save new user
    const user = new User({ name, email });
    await user.save();
    response.status(201).json({
      isError: false,
      message: "User created succesfully",
    });
  } catch (error) {
    const customError = new Error("Server error");
    customError.status = 500;
    customError.isError = true;
    customError.details = error.message;
    next(customError);
  }
}

export { getAllUsers, createUser };
