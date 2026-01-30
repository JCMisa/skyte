import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, getMessagesBetweenUsers, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getAllUsers);
router.get("/:id", protectRoute, getMessagesBetweenUsers);

router.post("/send/:id", protectRoute, sendMessage);

export default router;