import jwt from "jsonwebtoken";

export default async function authUser(request, response, next) {
    console.log(request.headers.authorization);
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
        // const error = new Error("Access denied. No token.");
        // error.status =
        return response.json({
            success: false,
            message: "Access denied. No token.",
        });
    }

    try {
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
        request.user = { user: { _id: decoded_token.userId } };
        next();
    } catch (error) {
        const isExpired = error.name === "TokenExpiredError";
        response.status(401).json({
            error: true,
            code: isExpired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
            message: isExpired ? "Token has expired, please log in again." : "Invalid Token.",
        });
        // next();
    }
}
