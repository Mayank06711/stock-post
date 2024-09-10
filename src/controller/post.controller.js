import { Stock } from "../model/stock.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create a new stock post
const createStockPost = asyncHandler(async (req, res, next) => {
  const { stockSymbol, title, description, tags } = req.body;
  console.log(req.body);
  if (!stockSymbol || !title || !description) {
    throw new ApiError(
      400,
      "Stock symbol, title, and description are required"
    );
  }

  const stock = new Stock({
    smybol: stockSymbol,
    title,
    desc: description,
    tags,
    owner: req.user._id, // authenticated user
  });
  console.log(stock);
  await stock.save();
  res.status(201).json({
    success: true,
    postId: stock._id,
    message: "Post created successfully",
  });
});

// Get all stock posts with pagination, filtering, and sorting
const getAllStockPosts = asyncHandler(async (req, res, next) => {
  const { stockSymbol, tags, sortBy, page = 1, limit = 10 } = req.query;

  let query = {};
  if (stockSymbol) query.symbol = stockSymbol;
  if (tags) query.tags = { $in: tags.split(",") };

  const sortOptions = {};
  if (sortBy === "likes") {
    sortOptions.likesCount = -1; // Sort by most likes
  } else {
    sortOptions.createdAt = -1; // Default to sort by most recent
  }

  const totalPosts = await Stock.countDocuments(query);
  const stocks = await Stock.find(query)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate("owner", "username email")
    .exec();

  if (!stocks) {
    throw new ApiError(404, "No stock posts found");
  }
  res.status(200).json({
    success: true,
    posts: stocks,
    totalPosts,
    currentPage: page,
    totalPages: Math.ceil(totalPosts / limit),
  });
});

// Get a single stock post with comments
const getStockPostById = asyncHandler(async (req, res, next) => {
  const stock = await Stock.findById(req.params.postId)
    .populate("owner", "username email")
    .populate({
      path: "comments",
      populate: { path: "commentedBy", select: "username email" },
    });

  if (!stock) {
    throw new ApiError(404, "Stock post not found");
  }

  res.status(200).json({
    success: true,
    stock: {
      postId: stock._id,
      stockSymbol: stock.symbol,
      title: stock.title,
      description: stock.desc,
      likesCount: stock.likesCount,
      comments: stock.comments,
      createdAt: stock.createdAt,
    },
  });
});

// Delete a stock post by ID
const deleteStockPost = asyncHandler(async (req, res, next) => {
  const stock = await Stock.findById(req.params.postId);

  if (!stock) {
    throw new ApiError(404, "Stock post not found");
  }

  // Ensure the user deleting the stock post is the owner
  if (stock.owner.toString() !== req.user._id) {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  await stock.remove();
  res.status(200).json({ success: true, message: "Post deleted successfully" });
});

export { createStockPost, getAllStockPosts, getStockPostById, deleteStockPost };
