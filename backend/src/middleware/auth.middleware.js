import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import multer from "multer";

// next props is used to move to the next middleware or controller/function in the routes
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Not authorized, token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Not authorized, token invalid" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Not authorized, user not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// 1. Configure storage to use RAM (Memory), not Disk (will not store file on local server (file explorer))
const storage = multer.memoryStorage();

// 2. Add security limits and file filters
export const safeUpload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 2 }, // Limit to 2MB 
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed!"), false);
        }
    }
});