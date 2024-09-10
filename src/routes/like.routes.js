import express from 'express';
import {
  likeStockPost,
  unlikeStockPost
} from '../controller/like.controller.js';
import { verifyJWT } from '../middleware/verify.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /posts/{postId}/like:
 *   post:
 *     summary: Like a stock post
 *     description: Allows an authenticated user to like a specific stock post.
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the stock post to like
 *     responses:
 *       201:
 *         description: Post liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Post liked"
 *       400:
 *         description: User has already liked this post
 *       404:
 *         description: Stock post not found
 */
router.route('/:postId/like').post(verifyJWT, likeStockPost);

/**
 * @swagger
 * /posts/{postId}/like:
 *   delete:
 *     summary: Unlike a stock post
 *     description: Allows an authenticated user to unlike a stock post they previously liked.
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the stock post to unlike
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Post unliked"
 *       404:
 *         description: The user hasn't liked the post before
 */
router.route('/:postId/like').delete(verifyJWT, unlikeStockPost);

export default router;
