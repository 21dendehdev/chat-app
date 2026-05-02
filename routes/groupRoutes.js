const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const Message = require("../models/Message");

// Create a group
router.post("/", async (req, res) => {
  const { name, members, createdBy } = req.body;
  if (!name || !members || members.length < 2) {
    return res.status(400).json({ error: "Name and at least 2 members required." });
  }
  try {
    const group = new Group({ name, members, createdBy });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: "Failed to create group." });
  }
});

// Get all groups for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const groups = await Group.find({ members: req.params.userId });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch groups." });
  }
});

// Get group messages
router.get("/:groupId/messages", async (req, res) => {
  try {
    const messages = await Message.find({ groupId: req.params.groupId })
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch group messages." });
  }
});

module.exports = router;
