

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
console.log("REGISTER HIT:", req.body);
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password are required" });

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: "Username already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // First ever user becomes admin automatically
    const userCount = await User.countDocuments();
    const isAdmin = userCount === 0;

    const user = new User({ username, password: hashed, isAdmin });
    await user.save();

    res.status(201).json({ message: "Registered successfully", isAdmin });
  }catch (err) {
  console.error("❌ REGISTER ERROR:", err);  // 👈 SHOW IN TERMINAL
  res.status(500).json({ error: err.message }); // 👈 SEND REAL ERROR
}};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password are required" });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid username or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid username or password" });

    // Record login session
    const session = { loginTime: new Date(), logoutTime: null, duration: 0 };
    user.sessions.push(session);
    user.lastLoginAt = new Date();
    user.isOnline = true;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "campchat_secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar || "",
        bio: user.bio || "",
        isAdmin: user.isAdmin,
        contacts: user.contacts
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

exports.logout = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Close the last open session
    const openSession = [...user.sessions].reverse().find(s => !s.logoutTime);
    if (openSession) {
      const duration = Math.floor((Date.now() - new Date(openSession.loginTime)) / 1000);
      openSession.logoutTime = new Date();
      openSession.duration = duration;
      user.totalTimeSpent += duration;
    }

    user.isOnline = false;
    await user.save();

    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ error: "Logout failed" });
  }
};
