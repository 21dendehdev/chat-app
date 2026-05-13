require("dotenv").config();
const express    = require("express");
const http       = require("http");
const path       = require("path");
const fs         = require("fs");
const mongoose   = require("mongoose");
const cors       = require("cors");
const { Server } = require("socket.io");

const authRoutes    = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes    = require("./routes/userRoutes");
const groupRoutes   = require("./routes/groupRoutes");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes   = require("./routes/adminRoutes");
const socketHandler = require("./sockets/socket");

const app = express();

// ✅ Middleware — declared ONCE, at the top
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes — before the catch-all
app.use("/api/auth/login",     authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users",    userRoutes);
app.use("/api/groups",   groupRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/admin",    adminRoutes);

// ✅ Test route — before the catch-all
app.get("/test", (req, res) => {
  res.send("Server is working");
});

// ✅ Static uploads
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
app.use("/uploads", express.static(uploadsPath));

// ✅ Serve React build
const clientBuildPath = path.join(__dirname, "client", "build");
app.use(express.static(clientBuildPath));

// ✅ Catch-all LAST — only after all routes and static files
app.get(/.*/, (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API route not found" });
  }
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// ✅ DB + Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: { origin: "*", methods: ["GET", "POST"] }
    });
    socketHandler(io);
    server.listen(process.env.PORT || 5000, () =>
      console.log(`Server on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error("DB Error:", err));