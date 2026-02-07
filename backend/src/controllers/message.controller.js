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
        const { text } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;

        // Handle image upload if file exists
        if (req.file) {
            // Use a stream to send the buffer to Cloudinary
            const uploadStream = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "skyte/messages" },
                        (error, result) => {
                            if (result) resolve(result);
                            else reject(error);
                        }
                    );
                    stream.end(req.file.buffer);
                });
            };

            const cloudRes = await uploadStream();
            imageUrl = cloudRes.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text: text || null,
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