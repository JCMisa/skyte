import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

// routes
import authRoutes from "./routes/auth.route.js"

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})