const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("lastMessage");
  isChat = await User.populate(isChat, {
    path: "lastMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");

      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("lastMessage")
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "lastMessage.sender",
          select: "name pic email",
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroup = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }

  const users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  if (!chatId || !chatName) {
    res.status(400);
    throw new Error("ChatId and ChatName are required");
  }
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId) {
    res.status(400);
    throw new Error("ChatId and UserId are required");
  }

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

// const removeFromGroup = asyncHandler(async (req, res) => {
//   const { chatId, userId } = req.body;

//   if (!chatId || !userId) {
//     res.status(400);
//     throw new Error("ChatId and UserId are required");
//   }

//   const removed = await Chat.findByIdAndUpdate(
//     chatId,
//     {
//       $pull: { users: userId },
//     },
//     { new: true }
//   )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   if (!removed) {
//     res.status(404);
//     throw new Error("Chat not found");
//   } else {
//     res.json(removed);
//   }
// });

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    res.status(400);
    throw new Error("ChatId and UserId are required");
  }

  // Remove the user from the chat
  let chat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!chat) {
    res.status(404);
    throw new Error("Chat not found");
  }

  // If the removed user was the group admin, assign a new one
  if (chat.groupAdmin && chat.groupAdmin._id.toString() === userId) {
    if (chat.users.length > 0) {
      chat.groupAdmin = chat.users[0]._id; // assign first remaining user
      await chat.save();
    } else {
      chat.groupAdmin = undefined; // fallback, though this shouldn't normally happen
      await chat.save();
    }
  }

  // Re-populate in case admin changed
  chat = await Chat.findById(chat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.json(chat);
});

// const renameGroup = asyncHandler(async (req, res) => {
//   const { chatId, chatName } = req.body;

//   if (!chatId || !chatName) {
//     res.status(400);
//     throw new Error("ChatId and ChatName are required");
//   }

//   const chat = await Chat.findById(chatId);
//   if (!chat) {
//     res.status(404);
//     throw new Error("Chat Not Found");
//   }

//   if (chat.groupAdmin.toString() !== req.user._id.toString()) {
//     res.status(403);
//     throw new Error("Only the group admin can rename the group");
//   }
//   const updatedChat = await Chat.findByIdAndUpdate(
//     chatId,
//     {
//       chatName,
//     },
//     {
//       new: true,
//     }
//   )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   res.json(updatedChat);
// });

// const addToGroup = asyncHandler(async (req, res) => {
//   const { chatId, userId } = req.body;
//   if (!chatId || !userId) {
//     res.status(400);
//     throw new Error("ChatId and UserId are required");
//   }

//   const chat = await Chat.findById(chatId);
//   if (!chat) {
//     res.status(404);
//     throw new Error("Chat Not Found");
//   }

//   if (chat.groupAdmin.toString() !== req.user._id.toString()) {
//     res.status(403);
//     throw new Error("Only the group admin can add users");
//   }

//   const added = await Chat.findByIdAndUpdate(
//     chatId,
//     {
//       $push: { users: userId },
//     },
//     { new: true }
//   )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   res.json(added);
// });

// const removeFromGroup = asyncHandler(async (req, res) => {
//   const { chatId, userId, newGroupAdmin } = req.body;

//   if (!chatId || !userId) {
//     res.status(400);
//     throw new Error("ChatId and UserId are required");
//   }

//   // Find the chat to check the group admin
//   const chat = await Chat.findById(chatId);

//   if (!chat) {
//     res.status(404);
//     throw new Error("Chat not found");
//   }

//   // Check if the authenticated user is the group admin
//   if (chat.groupAdmin.toString() !== req.user._id.toString()) {
//     res.status(403);
//     throw new Error("Only the group admin can remove users");
//   }

//   // If the user to be removed is the group admin
//   if (userId.toString() === chat.groupAdmin.toString()) {
//     if (!newGroupAdmin) {
//       res.status(400);
//       throw new Error(
//         "Please provide a new group admin if removing the current group admin"
//       );
//     }

//     // Check if the new group admin exists in the chat users
//     const newAdminExists = chat.users.some(
//       (user) => user.toString() === newGroupAdmin.toString()
//     );
//     if (!newAdminExists) {
//       res.status(400);
//       throw new Error("New group admin must be a member of the group");
//     }

//     // Proceed to remove the old group admin and update the group admin
//     const updatedChat = await Chat.findByIdAndUpdate(
//       chatId,
//       {
//         $pull: { users: userId },
//         groupAdmin: newGroupAdmin, // Update the group admin
//       },
//       { new: true }
//     )
//       .populate("users", "-password")
//       .populate("groupAdmin", "-password");

//     return res.json(updatedChat);
//   }

//   // If the user to be removed is not the group admin, proceed as before
//   const updatedChat = await Chat.findByIdAndUpdate(
//     chatId,
//     {
//       $pull: { users: userId },
//     },
//     { new: true }
//   )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   return res.json(updatedChat);
// });

module.exports = {
  accessChat,
  fetchChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
