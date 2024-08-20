import { User } from '../models/user.model.js'; // Adjust the import path as needed
import { ApiResponse } from '../utils/ApiResponse.js'; // Adjust the import path as needed
import { ApiError } from '../utils/ApiError.js'; // Adjust the import path as needed

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}
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

const signIn = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!username && !email) {
            return res.status(400).json(new ApiResponse(400, null, "Username or email is required"));
        }

        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, "User does not exist"));
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json(new ApiResponse(401, null, "Invalid user credentials"));
        }

        const loggedInUser = await User.findById(user._id).select('-password');
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const options = {
            httpOnly: true,
            path: '/'
            // secure: true,
        };


        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged In Successfully"));

    } catch (error) {
        console.error(error);

        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        }
        return res.status(500).json(new ApiResponse(500, null, 'Server error'));
    }
};


const google = async (req, res) => {
    try {
        const { name, email, photo } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            const loggedInUser = await User.findById(user._id).select('-password ');
            const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
            const options = {
                httpOnly: true,
                path:"/"
            };
            console.log("Token",accessToken,refreshToken)

            return res
                .status(200)
                .cookie("accessTokeni", accessToken, options)
                .cookie("refreshTokenii", refreshToken, options)
                .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User Logged in Successfully"));
        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);


            const newUser = await User.create({
                username: name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-8),
                email,
                password: generatedPassword,
                profilePicture: photo,
            });

            const newUserDetails = await User.findById(newUser._id).select('-password');
            const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(newUser._id);

            const options = {
                httpOnly: true,
                path:"/",
            };

            return res
                .status(201)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json(new ApiResponse(201, { user: newUserDetails, accessToken, refreshToken }, "User registered and logged in successfully"));
        }

    } catch (error) {
        console.error(error);

        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        }
        return res.status(500).json(new ApiResponse(500, null, 'Server error'));
    }
};
const signOut= async(req, res)=>{
  
    // await User.findByIdAndUpdate(
    //     req.user._id,
    //     {
    //         $unset: {
    //             refreshToken: 1 
    //         }
    //     },
    //     {
    //         new: true
    //     }
    // )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
}
   


export {signIn,signUp,google , signOut}
