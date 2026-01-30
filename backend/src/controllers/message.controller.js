import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // find all users except the logged in user (which is yourself) and fetch all properties except password
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ error: error.message })
    }
}

export const getMessagesBetweenUsers = async (req, res) => {
    try {
        const { id: userToChatId } = req.params // get the id of the user you want to chat with from url params
        const myId = req.user._id; // my id

        // find messages where (sender is me and receiver is the other person) OR (sender is the other person and receiver is me)
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages between users:", error.message);
        res.status(500).json({ error: error.message })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            // upload the base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl || null
        });

        await newMessage.save();

        // todo: realtime functionality goes here ... (with socket.io)

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error.message);
        res.status(500).json({ error: error.message })
    }
}