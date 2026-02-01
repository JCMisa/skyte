import express from "express";
import { signin, signout, signup, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute, safeUpload } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/signout", signout)

router.put("/update-profile", protectRoute, safeUpload.single("profilePic"), updateProfile);

router.get("/check", protectRoute, checkAuth)

export default router;