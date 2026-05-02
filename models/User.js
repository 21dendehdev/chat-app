const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  loginTime:  { type: Date, default: Date.now },
  logoutTime: { type: Date, default: null },
  duration:   { type: Number, default: 0 } // seconds
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar:   { type: String, default: "" },
  bio:      { type: String, default: "" },
  isAdmin:  { type: Boolean, default: false },

  // Contacts: only these users appear in each other's sidebar
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // Session tracking
  sessions:       [sessionSchema],
  lastLoginAt:    { type: Date, default: null },
  totalTimeSpent: { type: Number, default: 0 }, // total seconds
  isOnline:       { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
