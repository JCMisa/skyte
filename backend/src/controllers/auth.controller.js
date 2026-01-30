import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please enter all required fields" });
        }

        // check if password is at least 6 characters long
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // check if user already exists based on the email as it is unique
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        })

        if (newUser) {
            // generate JWT token
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please enter all required fields" });
        }

        const user = await User.findOne({ email })
        // check if user exists
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.log("Error in signin controller:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const signout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Signed out successfully" });
    } catch (error) {
        console.log("Error in signout controller:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id

        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, { new: true });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updateProfile controller:", error.message);
        res.status(500).json({ message: error.message });
    }
}

// checks if user is authenticated and get the currently authenticated user
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller:", error.message);
        res.status(500).json({ message: error.message });
    }
}