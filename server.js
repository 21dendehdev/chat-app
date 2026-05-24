import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin:[ "http://localhost:3000",  "https://campchat-1.vercel.app"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.use(cors({
   origin:[ "http://localhost:3000","https://campchat-1.vercel.app" ],  credentials: true,
})); 
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("API RUNNING...");
});

// Import socket handler from sockets folder
import socketHandler from "./sockets/socket.js";
socketHandler(io);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Socket.IO enabled`);
});