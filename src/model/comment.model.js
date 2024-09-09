import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "Comment can not be empty"],
    },
    stock: {
      type: Schema.Types.ObjectId,
      ref: "Stock",
    },
    commentedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
