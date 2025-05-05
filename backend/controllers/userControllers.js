const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const Message = require("../models/messageModel");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const getNotifications = asyncHandler(async (req, res) => {
  try {
    // Find the user and populate notifications (which are references to messages)
    const user = await User.findById(req.user._id).populate({
      path: "notifications", // This will populate the notifications array (Message references)
      populate: [
        {
          path: "sender", // Populate sender's details for the message
          select: "name pic email",
        },
        {
          path: "chat", // Populate chat details
          populate: {
            path: "users", // Populate users involved in the chat
            select: "name pic email",
          },
        },
      ],
    });

    if (user && user.notifications) {
      res.json(user.notifications); // Send back the populated notifications
    } else {
      res.status(404);
      throw new Error("User notifications not found");
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const addNotification = asyncHandler(async (req, res) => {
  const { messageId } = req.body;

  if (!messageId) {
    res.status(400);
    throw new Error("Message ID is required");
  }

  try {
    // Atomically add messageId to notifications without duplicates
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { notifications: messageId } },
      { new: true }
    );

    // Refetch user with populated notifications
    const updatedUser = await User.findById(req.user._id).populate({
      path: "notifications",
      populate: [
        {
          path: "sender",
          select: "name pic email",
        },
        {
          path: "chat",
          populate: {
            path: "users",
            select: "name pic email",
          },
        },
      ],
    });

    res.status(200).json({
      message: "Notification added",
      notifications: updatedUser.notifications,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const removeNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.body;
  if (!notificationId) {
    res.status(400);
    throw new Error("Notification ID is required");
  }

  // Remove the notification from user's notifications array using $pull
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { notifications: notificationId },
  });

  // Return the updated and populated notifications
  const updatedUser = await User.findById(req.user._id).populate({
    path: "notifications",
    populate: [
      {
        path: "sender",
        select: "name pic email",
      },
      {
        path: "chat",
        populate: {
          path: "users",
          select: "name pic email",
        },
      },
    ],
  });

  res.status(200).json(updatedUser.notifications);
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  getNotifications,
  addNotification,
  removeNotification,
};
