import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
    console.log("HELLO");
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request: Token not found");
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            if (err instanceof jwt.JsonWebTokenError) {
                throw new ApiError(401, "Invalid access token");
            } else if (err instanceof jwt.TokenExpiredError) {
                throw new ApiError(401, "Access token expired");
            } else {
                throw new ApiError(401, "Unauthorized request: " + err.message);
            }
        }

        if (!decodedToken || !decodedToken._id) {
            throw new ApiError(401, "Unauthorized request: Invalid token");
        }

        const user = await User.findById(decodedToken._id).select("-password");

        if (!user) {
            throw new ApiError(401, "Unauthorized request: User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in verifyJWT middleware:", error);
        next(error); // Pass the error to the next middleware
    }
};
