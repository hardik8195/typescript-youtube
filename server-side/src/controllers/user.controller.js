import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { Video } from "../models/video.model.js";



const generateRefreshandAcessToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while Generating access token and refresh token")
    }
}
const registerUser = asyncHandler(async (req, res) => {

    //get data from frontend:
    const { fullName, username, password, email } = req.body;


    //validation check:
    if (fullName === undefined) throw new ApiError(400, "All fields are required")
    if (username === undefined) throw new ApiError(400, "All fields are required")
    if (password === undefined) throw new ApiError(400, "all fields are required")
    if (email === undefined) throw new ApiError(400, "All fields are required")

    //check if user exists:
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) throw new ApiError(409, "User already exists")

    //check for images and avatar:
    // const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;  //gives an undefined error

    let avatarLocalPath;
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path;
    }

    if (!avatarLocalPath) throw new ApiError(400, "Avatar is required")



    // upload on avatar and coverImages on cloudinary on any other third pary services
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar) throw new ApiError(400, "avatar is required")

    //create a entry in database 
    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        password,
        email,
        avatar: avatar.url,
    })

    //remove password and refreshToken field from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    //check for user creation
    if (!createdUser) throw new ApiError(500, "something went wrong")

    //return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "Succesfully user registered")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    //get email or username and password from the user
    //validation check
    //find the user
    //validate password
    //generate accesss token
    //generate refresh token

    const { email, password, username } = req.body;

    if (!email && !username) throw new ApiError(400, "username and email is required")

    const user = await User.findOne({
        $or: [{ username, email }]
    })

    if (!user) throw new ApiError(404, "The user do not exist")

    const userIsValid = await user.isPasswordCorrect(password)

    if (!userIsValid) throw new ApiError(401, "Password is incorrect")

    const { refreshToken, accessToken } = await generateRefreshandAcessToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ data: loggedInUser, refreshToken, accessToken });

})
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        )

})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorised request");

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = User.findById(decodedToken?._id);

        if (!user) throw new ApiError(401, "unvalid refresh token")

        if (incomingRefreshToken != user?.refreshToken) {
            throw new ApiError(401, "your refresh token got expired")

        }

        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, newrefreshToken } = await generateRefreshandAcessToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(
                new ApiResponse(
                    201,
                    {
                        accessToken, refreshToken: newrefreshToken
                    }
                )
            )
    } catch (error) {
        new ApiError(401, error?.message);
    }
})

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    return res
        .status(200)
        .json(user)
})
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email, username } = req.body

    if (!fullName || !email) throw new ApiError(401, "All fields are required");
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: fullName,
                email: email,
                username: username
            }

        },
        {
            new: true
        }
    )
    return res
        .status(200)
        .json(
            new ApiResponse(201, user, "Suceesfully updated your information")
        )
})
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(
        req.user?._id
    )
    return res
        .status(200)
        .json(
            new ApiResponse(201, {}, "Successfully deleted your account")
        )
})
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;


    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) throw new ApiError(401, "Invalid old Password");

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "password is changed")
        )
})

const subcribe = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $push: { subscribedUsers: req.params.id }
        }
    )
    await User.findByIdAndUpdate(
        req.params.id, {
        $inc: { subscribers: 1 }
    }
    )
    return res
        .status(200)
        .json("subscription successfull")

})
const unsubcribe = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { subscribedUsers: req.params.id }
        }
    )
    await User.findByIdAndUpdate(
        req.params.id, {
        $inc: { subscribers: -1 }
    }
    )
    return res
        .status(200)
        .json("unsubscription successfull")

})

const save = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $push: { savedVideos: req.params.videoId }
    })
    return res
        .status(200)
        .json("successfully saved video")
})

const unsave = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(req.user._id, {
        $pull: { savedVideos: req.params.videoId }
    })

    return res
        .status(200)
        .json("successfully unsaved video")
})

const handleHistory = asyncHandler(async (req,res)=> {
    await User.findByIdAndUpdate(req.user._id,{
        $push:{watchHistory:req.params.videoId}
    })
    return res.status(200).json("successfully added in history")
})

const likes = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;
    const video = await Video.findById(videoId);
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    if (!video) {
        return res.status(404).json({ message: 'Video not found' });
    }
    if (!video.likes.includes(req.user._id)) {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { likes: req.user._id },
            $pull: { dislikes: req.user._id }
        });
    }
    return res
        .status(201)
        .json("the vedio is liked")
})
const dislikes = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;
    const video = await Video.findById(videoId);
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    if (!video) {
        return res.status(404).json({ message: 'Video not found' });
    }
    if (!video.dislikes.includes(req.user._id)) {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: req.user._id },
            $pull: { likes: req.user._id }
        });
    }
    return res
        .status(201)
        .json("the vedio is disliked")
})
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getUser,
    updateAccountDetails,
    deleteUser,
    subcribe,
    unsubcribe,
    likes,
    dislikes,
    save,
    unsave,
    handleHistory
}

