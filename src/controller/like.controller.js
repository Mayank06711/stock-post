import { Stock } from "../model/stock.model.js";
import { Like } from "../model/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { emitLikeUpdate } from "../socket/socketManager.js";
const likeStockPost = asyncHandler(async (req, res, next) => {
  const stock = await Stock.findById(req.params.postId).populate(
    "owner",
    "username"
  );

  if (!stock) {
    throw new ApiError(404, "Stock post not found");
  }

  const alreadyLiked = await Like.findOne({
    stock: req.params.postId,
    likedBy: req.user.id,
  });

  if (alreadyLiked) {
    throw new ApiError(400, "You have already liked this post");
  }

  const like = new Like({
    stock: req.params.postId,
    likedBy: req.user.id,
  });

  await like.save();

  // Increment the like count in the stock post
  stock.likesCount += 1;
  await stock.save();
  emitLikeUpdate(stock.owner._id, {
    postId: stock._id,
    likeCount: stock.likesCount,
    username: stock.owner.username,
    action: "LIKE",
  });
  res.status(201).json({ success: true, message: "Post liked" });
});

// Unlike a stock post
const unlikeStockPost = asyncHandler(async (req, res, next) => {
  const like = await Like.findOne({
    stock: req.params.postId,
    likedBy: req.user.id,
  });

  if (!like) {
    throw new ApiError(404, "You have not liked this post");
  }

  await like.remove();

  // Decrement the like count in the stock post
  const stock = await Stock.findById(req.params.postId);
  stock.likesCount -= 1;
  await stock.save();

  res.status(200).json({ success: true, message: "Post unliked" });
});

export { likeStockPost, unlikeStockPost };
