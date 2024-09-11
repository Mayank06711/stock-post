import { Stock } from "../model/stock.model.js";
import { Comment } from "../model/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { emitCommentUpdate } from "../socket/socketManager.js";
const addComment = asyncHandler(async (req, res) => {
  const stock = await Stock.findById(req.params.postId).populate("owner");

  if (!stock) {
    throw new ApiError(404, "Post not found");
  }

  const { comment } = req.body;

  if (!comment) {
    throw new ApiError(400, "Comment content is required");
  }

  const newComment = new Comment({
    content: comment,
    stock: stock._id,
    commentedBy: req.user._id,
  });

  await newComment.save();

  // emiting the socket event for real time notification
  emitCommentUpdate(stock.owner._id, {
    postId: req.params.postId,
    comment: {
      commentId: newComment._id,
      content: newComment.content,
      commentedBy: stock.owner.username, // The user who made the comment
      createdAt: newComment.createdAt,
    },
    action: "Comment",
  });
  res.status(201).json({
    success: true,
    commentId: newComment._id,
    message: "Comment added successfully",
  });
});

// Delete a comment by ID
const deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Ensure the user deleting the comment is the owner
  console.log("Comment deleted",comment.commentedBy,req.user._id)
  if (comment.commentedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await Comment.findByIdAndDelete(comment._id)
  res
    .status(200)
    .json({ success: true, message: "Comment deleted successfully" });
});

export { addComment, deleteComment };
