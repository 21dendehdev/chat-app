const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages.map(({ _id, senderId, receiverId, senderName, senderAvatar, message, timestamp }) => ({
      _id,
      senderId,
      receiverId,
      senderName,
      senderAvatar,
      message,
      timestamp
    })));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
