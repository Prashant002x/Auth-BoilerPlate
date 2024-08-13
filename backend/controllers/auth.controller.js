import { User } from '../models/user.model.js'; // Adjust the import path as needed
import { ApiResponse } from '../utils/ApiResponse.js'; // Adjust the import path as needed
import { ApiError } from '../utils/ApiError.js'; // Adjust the import path as needed

const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json(new ApiResponse(400, null, 'All fields are required'));
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json(new ApiResponse(400, null, 'User already exists'));
        }

        const user = await User.create({ username, email, password });

        const createdUser = await User.findById(user._id).select('-password');

        if (!createdUser) {
            throw new ApiError(500, 'Something went wrong while registering the user');
        }

        return res.status(201).json(new ApiResponse(201, createdUser, 'User registered successfully'));

    } catch (error) {
        console.error(error);

        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        }
        return res.status(500).json(new ApiResponse(500, null, 'Server error'));
    }
};

export default signUp;
