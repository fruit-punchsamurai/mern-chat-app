const express = require("express");
const { chats } = require("./data/data");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); //to accept JSON data

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API is running successfully");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started at Port: ${PORT}`));
