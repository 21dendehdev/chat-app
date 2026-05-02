const Message = require("../models/Message");

const onlineUsers = {}; // userId -> socketId

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Register user and broadcast online list
    socket.on("register_user", (userId) => {
      socket.userId = userId;
      onlineUsers[userId] = socket.id;
      io.emit("online_users", Object.keys(onlineUsers));
      console.log(`User ${userId} is online`);
    });

    // Join a group room
    socket.on("join_group", (groupId) => {
      socket.join(`group_${groupId}`);
    });

    // ── DIRECT MESSAGE ──
    socket.on("send_message", async (data) => {
      const { senderId, senderName, senderAvatar, receiverId, message } = data;
      try {
        const newMessage = new Message({
          senderId, receiverId, senderName,
          senderAvatar: senderAvatar || "",
          message,
          timestamp: data.timestamp || new Date()
        });
        const saved = await newMessage.save();
        data._id = saved._id;

        const receiverSocket = onlineUsers[receiverId];
        if (receiverSocket) {
          io.to(receiverSocket).emit("receive_message", data);
        }
      } catch (err) {
        console.error("send_message error:", err);
      }
    });

    // ── DELETE MESSAGE ──
    socket.on("delete_message", async ({ messageId, requesterId }) => {
      try {
        const msg = await Message.findById(messageId);
        if (!msg) return;

        await Message.findByIdAndDelete(messageId);

        const payload = {
          messageId,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          groupId: msg.groupId || null
        };

        const recipientSocket = onlineUsers[msg.receiverId];
        const senderSocket = onlineUsers[msg.senderId];

        if (recipientSocket) {
          io.to(recipientSocket).emit("message_deleted", payload);
        }
        if (senderSocket && senderSocket !== socket.id) {
          io.to(senderSocket).emit("message_deleted", payload);
        }
      } catch (err) {
        console.error("delete_message error:", err);
      }
    });

    // ── GROUP MESSAGE ──
    socket.on("send_group_message", async (data) => {
      const { senderId, senderName, senderAvatar, groupId, message } = data;
      try {
        const newMessage = new Message({
          senderId, senderName,
          senderAvatar: senderAvatar || "",
          groupId, message,
          timestamp: data.timestamp || new Date()
        });
        const saved = await newMessage.save();
        data._id = saved._id;

        // Broadcast to everyone in the group room except sender
        socket.to(`group_${groupId}`).emit("receive_group_message", data);
      } catch (err) {
        console.error("send_group_message error:", err);
      }
    });

    // ── TYPING (DM) ──
    socket.on("typing", ({ senderId, senderName, receiverId }) => {
      const receiverSocket = onlineUsers[receiverId];
      if (receiverSocket) {
        io.to(receiverSocket).emit("typing", { senderId, senderName });
      }
    });

    // ── TYPING (GROUP) ──
    socket.on("group_typing", ({ senderId, senderName, groupId }) => {
      socket.to(`group_${groupId}`).emit("typing", { senderId, senderName, groupId });
    });

    // ── DISCONNECT ──
    socket.on("disconnect", () => {
      if (socket.userId && onlineUsers[socket.userId] === socket.id) {
        delete onlineUsers[socket.userId];
        io.emit("online_users", Object.keys(onlineUsers));
        console.log(`User ${socket.userId} went offline`);
      }
    });
  });
};
