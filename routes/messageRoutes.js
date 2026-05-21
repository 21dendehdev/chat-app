import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// Get conversation between two users
router.get("/:userId/:otherUserId", async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    }).sort({ timestamp: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save new message
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId, senderName, senderAvatar, message, groupId } = req.body;
    
    const newMessage = new Message({
      senderId,
      receiverId: receiverId || null,
      groupId: groupId || null,
      senderName,
      senderAvatar: senderAvatar || "",
      message,
      timestamp: new Date(),
      read: false,
    });
    
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ message: error.message });
  }
});

// Mark messages as read
router.put("/mark-read/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    
    await Message.updateMany(
      {
        senderId: senderId,
        receiverId: receiverId,
        read: false
      },
      {
        read: true,
        readAt: new Date()
      }
    );
    
    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;