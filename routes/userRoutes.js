const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const User = require("../models/User");
const {
  updateName,
  changePassword,
  updateAvatar
} = require("../controllers/userController");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed."));
  }
});

router.put("/name", updateName);
router.put("/password", changePassword);
router.put("/avatar", updateAvatar);

router.post("/upload-avatar/:id", upload.single("avatar"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Avatar file is required." });
  }

  const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar: avatarUrl },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to upload avatar." });
  }
});

// Get all users (for now)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Search user
router.get("/search/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const users = await User.find({
      username: { $regex: username, $options: "i" }
    }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

router.put("/update/:id", async (req, res) => {
  const { avatar, bio } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar, bio },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;
