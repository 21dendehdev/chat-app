const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

// GET dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const totalUsers   = await User.countDocuments({ isAdmin: false });
    const onlineUsers  = await User.countDocuments({ isOnline: true, isAdmin: false });
    const totalMessages = await Message.countDocuments();
    const newToday = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) },
      isAdmin: false
    });

    res.json({ totalUsers, onlineUsers, totalMessages, newToday });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// GET all users with session info
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select("-password")
      .sort({ createdAt: -1 });

    const result = users.map(u => ({
      _id:            u._id,
      username:       u.username,
      avatar:         u.avatar,
      bio:            u.bio,
      isOnline:       u.isOnline,
      createdAt:      u.createdAt,
      lastLoginAt:    u.lastLoginAt,
      totalTimeSpent: u.totalTimeSpent, // seconds
      contactCount:   u.contacts.length,
      sessionCount:   u.sessions.length,
      lastSession:    u.sessions.length > 0 ? u.sessions[u.sessions.length - 1] : null
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET a single user's messages (conversations)
router.get("/messages/:userId", async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.userId },
        { receiverId: req.params.userId }
      ]
    }).sort({ timestamp: -1 }).limit(100);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// GET a user's session history
router.get("/sessions/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("username sessions totalTimeSpent");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// DELETE a user
router.delete("/users/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isAdmin) return res.status(403).json({ error: "Cannot delete admin" });

    // Remove from all contacts
    await User.updateMany(
      { contacts: req.params.userId },
      { $pull: { contacts: req.params.userId } }
    );

    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// POST make a user admin
router.post("/make-admin/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { isAdmin: true }, { new: true });
    res.json({ message: user.username + " is now an admin" });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

module.exports = router;
