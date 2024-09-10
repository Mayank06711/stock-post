import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    // if we like a video
    stock: {
      type: Schema.Types.ObjectId,
      ref: "Stock",
    },
    // who liked
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likeSchema);
