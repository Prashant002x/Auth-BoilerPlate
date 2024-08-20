import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, _, next) => {
    try {
      
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    //    const token = req.body.token 
// console.log("Token:", token); 
// console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET); 
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken || !decodedToken._id) {
            throw new ApiError(401, "Invalid access token");
        }

        const user = await User.findById(decodedToken._id).select("-password");
        console.log("PRasahtn " ,user)
        if (!user) {
            throw new ApiError(401, "User not found");
        }

        req.user = user;  
        next();
    } catch (error) {
        // Handle errors
        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            return next(new ApiError(401, "Invalid access token"));
        }
        return next(new ApiError(401, error?.message || "Unauthorized request"));
    }

};
