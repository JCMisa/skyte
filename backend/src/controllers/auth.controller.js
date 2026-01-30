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

export const signin = (req, res) => {
    res.send("Signin Route");
}

export const signout = (req, res) => {
    res.send("Signout Route");
}