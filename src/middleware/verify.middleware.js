import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unathorized Request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid  access token");
    }

    req.user = {
      _id: user._id,
      email: user.email,
    };
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const errorHandler = (err, req, res, next) => {
  err.statusCode ||= 500;
  err.message = err.message || "Internal Server Error, please try again later";
  if (err.code === 11000) {
    const error = Object.keys(err.keyPattern).join(",");
    err.message = `Duplicate key ${error}`;
    err.statusCode = err.statusCode;
  }
  const errorMess = new ApiError(err.statusCode, err.message, err, err.stack);
  console.log("\n", errorMess, "\n dh", err.message);
  res.status(err.statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV.trim() === "DEVELOPMENT" ? errorMess : err.message,
  });
};
