import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const test = (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, null, "API is running"));
};

const updateUser = async (req, res) => {
    try {
        if (req.user.id !== req.params.id) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, "You can update only your account"));
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                },
            },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "User not found"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, { user: updatedUser }, "User update successful"));

    } catch (error) {
        console.error(error);

        if (error instanceof ApiError) {
            return res
                .status(error.statusCode)
                .json(new ApiResponse(error.statusCode, null, error.message));
        }

        return res
            .status(500)
            .json(new ApiResponse(500, null, "Server error"));
    }
};

const deleteUser= async(req, res) =>{

    try{
        if (req.user.id !== req.params.id) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, "You can Delete only your account"));
        }
        await User.findByIdAndDelete(req.params.id);
        return res
        .status(200)
        .json(
            new ApiResponse(200,null, "User Deleted SuccessFully")
        )
    }
    catch(error) {
        console.error(error);

        if (error instanceof ApiError) {
            return res
                .status(error.statusCode)
                .json(new ApiResponse(error.statusCode, null, error.message));
        }

        return res
            .status(500)
            .json(new ApiResponse(500, null, "Server error"));
    }
}
export { updateUser, test ,deleteUser};
