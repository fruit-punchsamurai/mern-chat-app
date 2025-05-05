const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const User = require("./models/userModel");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); //to accept JSON data

app.get("/", (req, res) => {
  res.send("API is running successfully");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server started at Port: ${PORT}`));

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    if (userData && userData._id) {
      onlineUsers.set(userData._id, socket.id);
    }
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joinned Room: " + room);
  });

  socket.on("new message", async (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach(async (user) => {
      if (user._id === newMessageReceived.sender._id) {
        return;
      }
      const isUserOnline = onlineUsers.has(user._id);
      if (!isUserOnline) {
        console.log(user._id);
        try {
          await User.findByIdAndUpdate(user._id, {
            $push: { notifications: newMessageReceived._id },
          });
        } catch (error) {
          console.log("Error adding notification:", error);
        }
      }
      socket.in(user._id).emit("message recieved", newMessageReceived);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing", room));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing", room));

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");

    // Find and remove the disconnected user from online users
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
