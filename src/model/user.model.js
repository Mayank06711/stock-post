import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      trim: true,
      toLowerCase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          // Regular expression for email validation
          return /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\]$/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid email format!`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      validate: {
        validator: function (v) {
          // Check if the password contains '@'
          return /[@#$%]/.test(v);
        },
        message:
          "Password must contain at least one of the following special characters: @, #, $, % ",
      },
    },
    bio: { type: String, default: "User" },
    avatar: {
      url: { type: String, required: true },
      public_Id: { type: String, required: true },
    },
    refreshToken: {
      type: String,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// adding hook to hash the user password
userSchema.pre("save", async function (next) {
  // if the password field has been modified
  if (!this.isModified("password")) return next(); // If not modified, next middleware

  // Hash the password
  this.password = await bcrypt.hashSync(this.password, 10);

  next(); //next middleware
});

// method to check if the user password
userSchema.methods.isPasswordCorrect = async function (password) {
  // Compare the provided password with the hashed password stored in the current user document
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      // payload
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET, // secret
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // expiry
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
