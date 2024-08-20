import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
    console.log("HELLO");
    try {
        // console.log("Request Headers:", req.headers);
        // console.log("Request Cookies:", req.cookies);

        // Extract token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // console.log("Token:", token);

        if (!token) {
            throw new ApiError(401, "Unauthorized request: Token not found");
        }


        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded Token:", decodedToken);

        if (!decodedToken || !decodedToken._id) {
            throw new ApiError(401, "Unauthorized request: Invalid token");
        }

     
        const user = await User.findById(decodedToken._id).select("-password");
        console.log("User:", user);

        if (!user) {
            throw new ApiError(401, "Unauthorized request: User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new ApiError(401, "Invalid access token"));
        } else if (error instanceof jwt.TokenExpiredError) {
            return next(new ApiError(401, "Access token expired"));
        } else {
            return next(new ApiError(401, "Unauthorized request: " + error.message));
        }
    }
};
