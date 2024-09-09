import { Router } from "express";
import {registerUser, loginUser, getUserProfile ,updateUserProfile, refreshAccessTooken} from "../controller/user.controller.js"
import {uploadAvatar} from "../middleware/multer.middleware.js"
import {verifyJWT} from "../middleware/verify.middleware.js"

const router = new Router();

router.post("/register", uploadAvatar, registerUser);

router.post("/login", loginUser);

router.get("/profile:/userId", verifyJWT, getUserProfile);

router.put("/profile", verifyJWT, uploadAvatar, updateUserProfile);

router.get("/token", refreshAccessTooken);

export default router;


