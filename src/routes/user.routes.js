import { Router } from "express";
import {registerUser, loginUser, getUserProfile ,updateUserProfile, refreshAccessTooken} from "../controller/user.controller.js"
import {uploadAvatar} from "../middleware/multer.middleware.js"
import {verifyJWT} from "../middleware/verify.middleware.js"

const router = new Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with email, username, password, and optional bio.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: password123
 *               bio:
 *                 type: string
 *                 example: I am a software developer.
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: string
 *       400:
 *         description: Bad request, missing fields
 *       409:
 *         description: Conflict, user already exists
 */

router.route("/register").post(uploadAvatar.single('avatar'), registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     description: Logs in a user with email and password and returns access and refresh tokens.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Bad request, missing email or password
 *       404:
 *         description: User not found or password incorrect
 */

router.route("/login").post(loginUser);

/**
 * @swagger
 * /user/profile/{userId}:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the profile information of a user by their user ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: 66df67b9760197212368dfef
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 avatar:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     public_Id:
 *                       type: string
 *       401:
 *         description: User not found
 */

router.route("/profile/:userId").get( verifyJWT, getUserProfile);

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Update user profile
 *     description: Updates the profile information of a user including avatar.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johnsmith
 *               bio:
 *                 type: string
 *                 example: Updated bio
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request, missing username
 *       500:
 *         description: Internal server error, failed to update profile
 */

router.route("/profile").put(verifyJWT, uploadAvatar.single('avatar'), updateUserProfile);

/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: Refresh access token
 *     description: Refreshes the access token using a valid refresh token.
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Unauthorized, invalid refresh token
 */

router.route("token").get(refreshAccessTooken);

export default router;


