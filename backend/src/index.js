import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'

// routes
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

// routes
app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})