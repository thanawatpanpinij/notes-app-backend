import authService from "../../services/auth.service.js";

async function createAccount(request, response, next) {
  const { fullName, email, password, role = "user" } = request.body;

  if (!fullName || !email || !password) {
    return response.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const isExistingUser = await authService.findUserEmail({ email });
    if (isExistingUser) {
      return response
        .status(409)
        .json({ success: false, message: "Email already in use." });
    }

    const user = await authService.createUser({
      fullName,
      email,
      password,
      role,
    });
    response.status(201).json({
      success: true,
      message: "User registered succesfully!",
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
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
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }
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
    const isProd = process.env.NODE_ENV === "production";

    response.cookie("accessToken", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });
    response.json({
      success: true,
      message: "Login successful!",
    });
  } catch (error) {
    const customError = new Error("Server Error");
    customError.status = 500;
    customError.success = false;
    customError.details = error.message;
    next(customError);
  }
}

async function logout(request, response, next) {
  const isProd = process.env.NODE_ENV === "production";
  response.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
  response.json({ success: true, message: "Logged out successfully" });
}

export { createAccount, login, logout };
