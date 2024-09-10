import express from 'express';
import {
  addComment,
  deleteComment
} from '../controller/comment.controller.js';
import { verifyJWT } from '../middleware/verify.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /posts/{postId}/comments:
 *   post:
 *     summary: Add a comment to a stock post
 *     description: Allows an authenticated user to add a comment on a specific stock post.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the stock post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "This is a great post about Apple stock!"
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 commentId:
 *                   type: string
 *                   example: "60c72b1f9b1e8c42b87d9d02"
 *                 message:
 *                   type: string
 *                   example: "Comment added successfully"
 *       400:
 *         description: Invalid input, comment is required
 *       404:
 *         description: Stock post not found
 */
router.route('/:postId/comments').post(verifyJWT, addComment);

/**
 * @swagger
 * /posts/{postId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment by ID
 *     description: Allows the owner of a comment to delete it.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the stock post
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to be deleted
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Comment deleted successfully"
 *       403:
 *         description: Unauthorized, you are not the owner of the comment
 *       404:
 *         description: Comment not found
 */
router.route('/:postId/comments/:commentId').delete(verifyJWT, deleteComment);

export default router;
