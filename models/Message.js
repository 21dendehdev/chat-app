const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId:    { type: String, required: true },
  senderName:  { type: String, default: "" },
  senderAvatar:{ type: String, default: "" },

  // For DMs
  receiverId:  { type: String, default: null },

  // For group messages
  groupId:     { type: String, default: null },

  message:     { type: String, required: true },
  read:        { type: Boolean, default: false },
  timestamp:   { type: Date, default: Date.now }
});

// Index for fast DM queries
messageSchema.index({ senderId: 1, receiverId: 1, timestamp: 1 });
// Index for fast group queries
messageSchema.index({ groupId: 1, timestamp: 1 });

module.exports = mongoose.model("Message", messageSchema);
