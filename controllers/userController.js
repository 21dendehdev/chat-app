const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ✏️ Update Name
exports.updateName = async (req, res) => {
  const { userId, username } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update name" });
  }
};

// 🔒 Change Password
exports.changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Wrong password" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to change password" });
  }
};

// 👤 Update Avatar
exports.updateAvatar = async (req, res) => {
  const { userId, avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update avatar" });
  }
};