const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// GET my contacts only
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("contacts", "-password -sessions");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.contacts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// POST add a contact by username (both sides)
router.post("/add", authMiddleware, async (req, res) => {
  const { userId, targetUsername } = req.body;
  try {
    const me = await User.findById(userId);
    const target = await User.findOne({ username: targetUsername });

    if (!target) return res.status(404).json({ error: "User not found" });
    if (target._id.toString() === userId)
      return res.status(400).json({ error: "You cannot add yourself" });
    if (me.contacts.map(c => c.toString()).includes(target._id.toString()))
      return res.status(400).json({ error: "Already in your contacts" });

    // Add both ways (mutual contact)
    me.contacts.push(target._id);
    target.contacts.push(me._id);
    await me.save();
    await target.save();

    res.json({ message: "Contact added", contact: { _id: target._id, username: target.username, avatar: target.avatar } });
  } catch (err) {
    res.status(500).json({ error: "Failed to add contact" });
  }
});

// DELETE remove a contact
router.delete("/remove", authMiddleware, async (req, res) => {
  const { userId, targetId } = req.body;
  try {
    await User.findByIdAndUpdate(userId, { $pull: { contacts: targetId } });
    await User.findByIdAndUpdate(targetId, { $pull: { contacts: userId } });
    res.json({ message: "Contact removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove contact" });
  }
});

// POST generate a contact link/code (simple invite via username share)
router.post("/generate-link", authMiddleware, async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate a simple shareable invite code: base64 of userId+username
    const payload = Buffer.from(JSON.stringify({ id: user._id, username: user.username })).toString("base64url");
    const link = `${process.env.CLIENT_URL || "http://localhost:3000"}/add-contact/${payload}`;

    res.json({ link, code: payload });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate link" });
  }
});

// POST accept an invite link
router.post("/accept-link", authMiddleware, async (req, res) => {
  const { userId, code } = req.body;
  try {
    const decoded = JSON.parse(Buffer.from(code, "base64url").toString());
    const targetId = decoded.id;

    const me = await User.findById(userId);
    const target = await User.findById(targetId);

    if (!target) return res.status(404).json({ error: "Invite is invalid or expired" });
    if (target._id.toString() === userId)
      return res.status(400).json({ error: "You cannot add yourself" });
    if (me.contacts.map(c => c.toString()).includes(target._id.toString()))
      return res.status(400).json({ error: "Already in your contacts" });

    me.contacts.push(target._id);
    target.contacts.push(me._id);
    await me.save();
    await target.save();

    res.json({ message: "Contact added!", contact: { _id: target._id, username: target.username, avatar: target.avatar } });
  } catch (err) {
    res.status(500).json({ error: "Invalid invite link" });
  }
});

module.exports = router;
