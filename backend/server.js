const express = require("express");
const { chats } = require("./data/data");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); //to accept JSON data

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running successfully");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started at Port: ${PORT}`));
