import express from 'express';
import {
  createStockPost,
  getAllStockPosts,
  getStockPostById,
  deleteStockPost
} from '../controller/post.controller.js';
import { verifyJWT } from '../middleware/verify.middleware.js'; // authentication middleware 

const router = express.Router();

/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a new stock post
 *     description: Create a stock post related to a specific stock.
 *     tags: [Stock Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stockSymbol
 *               - title
 *               - description
 *             properties:
 *               stockSymbol:
 *                 type: string
 *                 example: AAPL
 *               title:
 *                 type: string
 *                 example: Apple Stock is Rising
 *               description:
 *                 type: string
 *                 example: Discussion about why Apple stock is growing
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [tech, growth]
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 postId:
 *                   type: string
 *                 message:
 *                   type: string
 *                   example: Post created successfully
 */
router.route('/create').post(verifyJWT, createStockPost);

/**
 * @swagger
 * /posts/all:
 *   get:
 *     summary: Get all stock posts
 *     description: Retrieve all stock posts with optional filters and pagination.
 *     tags: [Stock Posts]
 *     parameters:
 *       - in: query
 *         name: stockSymbol
 *         schema:
 *           type: string
 *         description: Stock symbol to filter posts (optional)
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Tags to filter posts by (optional)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, likes]
 *           default: date
 *         description: Sort posts by creation date or likes (optional)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination (optional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of posts per page (optional)
 *     responses:
 *       200:
 *         description: A list of stock posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       postId:
 *                         type: string
 *                       stockSymbol:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       likesCount:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */
router.route('/all').get(getAllStockPosts);

/**
 * @swagger
 * /{postId}:
 *   get:
 *     summary: Get a stock post by ID
 *     description: Retrieve a specific stock post along with its comments.
 *     tags: [Stock Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the stock post
 *     responses:
 *       200:
 *         description: A stock post with comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stock:
 *                   type: object
 *                   properties:
 *                     postId:
 *                       type: string
 *                     stockSymbol:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     likesCount:
 *                       type: integer
 *                     comments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           commentId:
 *                             type: string
 *                           userId:
 *                             type: string
 *                           comment:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 */
router.route('/:postId').get(getStockPostById);

/**
 * @swagger
 * /del/{postId}:
 *   delete:
 *     summary: Delete a stock post by ID
 *     description: Deletes a stock post if the user is the owner.
 *     tags: [Stock Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the stock post
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Post deleted successfully
 */
router.route('/del/:postId').delete(verifyJWT, deleteStockPost);

export default router;
