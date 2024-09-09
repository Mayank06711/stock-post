import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  uploadOnCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.fileupload.js";
import { User } from "../model/user.model.js";
import Jwt from "jsonwebtoken";

const createAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong, Error creating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, bio } = req.body;
  if ([email, username, password].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400, "All fields are required except bio");
  }
  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const avatarLocalPath = req?.file?.path; // from multer we get this access i.e files and avatar[0] from multer will conatin path

  if (!avatarLocalPath) {
    throw new ApiError(400, "user avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }

  const user = await User.create({
    username,
    email,
    password,
    bio: bio,
    avatar: {
      url: avatar.url,
      public_Id: avatar.public_Id,
    },
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registring the user");
  }

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    userId: createdUser._id,
  });
});


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email) {
    throw new ApiError(400, "email is reqiuired to login");
  }
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new ApiError(404, "User does not exist : Can't login");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(
      404,
      "Password does not match with your old password : Try again"
    );
  }
  const { accessToken, refreshToken } = await createAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  const data = {
    id: loggedInUser._id,
    username: loggedInUser.username,
    email: loggedInUser.email,
  };
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json({
      user: data,
      accessToken,
      refreshToken,
    });
});


const getUserProfile =  asyncHandler(async (req, res)=>{
   const {userId} = req.params;
    const user = await User.findById({_id:userId});
    if(!user){
        throw new ApiError(401, "User not found");
    }
    return res.status(200).json({
        id: user._id,
        username: user.username,
        bio: user.bio,
        avatar:user.avatar
    })
})

const updateUserProfile = asyncHandler(async (req, res)=>{
    const {username, bio} = req.body;
    if(!username){
      throw new ApiError(404, "Please enter a username to update")
    }
    const user = await User.findById({_id:req.user._id});
    if(!user){
        throw new ApiError(404, "User not found");
    }
    const avatar = req?.file.path;
    if(avatar){
      const deleteResult = await deleteImageFromCloudinary(user.avatar.url);
      
      if (!deleteResult || deleteResult.result !== "ok" ) {
        throw new ApiError(500, "Something went wrong while deleting old avatar");
      }  
     const data = await uploadOnCloudinary(avatar);
     if (!data) {
      throw new ApiError(500, "Something went wrong while uploading new avatar");
    }
     user.avatar = {url:data.url, public_Id:data.public_Id}
     await user.save();
    }
    return res.status(200).json({
      success: true,
      message: "Profile updated "
    })
})


const refreshAccessTooken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken 

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unathorized Access");
  }
  try {
    const decodedToken = Jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refreshToken");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } = await createAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({
        success: true,
        message: "Access token refreshed successfully",
        accessToken,
        refreshToken: newRefreshToken,
      });
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid newRefresh token");
  }
});

export { registerUser, loginUser, refreshAccessTooken, getUserProfile, updateUserProfile };
