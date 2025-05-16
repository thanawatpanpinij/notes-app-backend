import jwt from "jsonwebtoken";

export default async function authUser(request, response, next) {
  const token = request.cookies?.accessToken;
  if (!token) {
    return response.status(403).json({
      success: false,
      message: "Access denied. No token.",
    });
  }

  try {
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
    request.user = { user: { _id: decoded_token.userId, role: decoded_token.role } };
    next();
  } catch (error) {
    const isExpired = error.name === "TokenExpiredError";
    response.status(401).json({
      success: false,
      code: isExpired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
      message: isExpired ? "Token has expired, please log in again." : "Invalid Token.",
    });
  }
}
