import authService from "../../services/auth.service.js";

async function createAccount(request, response, next) {
  const { fullName, email, password, role } = request.body;

  if (!fullName || !email || !password || !role) {
    return response.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const isExistingUser = await authService.findUserEmail({ email });
    if (isExistingUser) {
      return response.status(409).json({ success: false, message: "Email already in use." });
    }

    const user = await authService.createUser({ fullName, email, password, role });
    response.status(201).json({
      success: true,
      message: "User registered succesfully!",
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

async function login(request, response, next) {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  try {
    const user = await authService.findUserEmail({ email });
    if (!user) {
      return response.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatched = authService.checkPassword(password, user.password);
    if (!isMatched) {
      return response.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = authService.signToken({ userId: user._id, role: user.role });
    response.json({
      success: true,
      message: "Login successful!",
      token,
    });
  } catch (error) {
    const customError = new Error("Server Error");
    customError.status = 500;
    customError.success = false;
    customError.details = error.message;
    next(customError);
  }
}

export { createAccount, login };
