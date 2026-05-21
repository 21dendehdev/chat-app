import Message from "../models/Message.js";

// Store online users
const onlineUsers = {};

// Normalize IDs to string to avoid type mismatch
const normalizeId = (id) => String(id);

export default (io) => {

  io.on("connection", (socket) => {

    console.log(`✅ Socket connected: ${socket.id}`);

    // REGISTER USER
    socket.on("register_user", (userId) => {
      const normalized = normalizeId(userId);
      if (!normalized) return;
      socket.userId = normalized;
      onlineUsers[normalized] = socket.id;
      io.emit("online_users", Object.keys(onlineUsers));
      console.log(`📱 User ${normalized} is online`);
      console.log("Online users:", Object.keys(onlineUsers));
    });

    // JOIN GROUP
    socket.on("join_group", (groupId) => {
      if (!groupId) return;
      socket.join(`group_${groupId}`);
      console.log(`User ${socket.userId} joined group ${groupId}`);
    });

    // DIRECT MESSAGE
    socket.on("send_message", async (data) => {
      console.log("📨 Received message:", data);
      
      try {
        let { senderId, receiverId, message, senderName, senderAvatar } = data;
        
        // Normalize IDs
        senderId = normalizeId(senderId);
        receiverId = normalizeId(receiverId);
        
        if (!senderId || !receiverId || !message) {
          console.log("Missing required fields");
          return;
        }
        
        // Save to database
        const newMessage = new Message({
          senderId,
          receiverId,
          senderName,
          senderAvatar: senderAvatar || "",
          message,
          timestamp: new Date(),
        });
        
        const savedMessage = await newMessage.save();
        console.log("✅ Message saved:", savedMessage._id);
        
        const messageData = {
          ...data,
          _id: savedMessage._id,
          timestamp: savedMessage.timestamp,
        };
        
        // Send to receiver if online (using normalized receiverId)
        const receiverSocket = onlineUsers[receiverId];
        if (receiverSocket) {
          io.to(receiverSocket).emit("receive_message", messageData);
          console.log("✅ Message sent to receiver");
        } else {
          console.log(`❌ Receiver ${receiverId} not online`);
        }
        
      } catch (error) {
        console.error("Error:", error.message);
      }
    });

    // GROUP MESSAGE
    socket.on("send_group_message", async (data) => {
      try {
        let { groupId, message, senderName, senderId, senderAvatar } = data;
        senderId = normalizeId(senderId);
        
        if (!groupId || !message) return;
        
        const newMessage = new Message({
          senderId,
          senderName,
          senderAvatar: senderAvatar || "",
          groupId,
          message,
          timestamp: new Date(),
        });
        
        const savedMessage = await newMessage.save();
        
        const messageData = {
          ...data,
          _id: savedMessage._id,
          timestamp: savedMessage.timestamp,
        };
        
        socket.to(`group_${groupId}`).emit("receive_group_message", messageData);
        console.log("✅ Group message sent");
        
      } catch (error) {
        console.error("Group message error:", error.message);
      }
    });

    // TYPING INDICATOR
    socket.on("typing", ({ senderId, senderName, receiverId }) => {
      const receiverSocket = onlineUsers[normalizeId(receiverId)];
      if (receiverSocket) {
        io.to(receiverSocket).emit("typing", { 
          senderId: normalizeId(senderId), 
          senderName 
        });
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      if (socket.userId && onlineUsers[socket.userId] === socket.id) {
        delete onlineUsers[socket.userId];
        io.emit("online_users", Object.keys(onlineUsers));
        console.log(`📱 User ${socket.userId} went offline`);
      }
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
    
  });
};