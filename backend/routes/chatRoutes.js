const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/creategroup").post(protect, createGroup);
router.route("/renamegroup").put(protect, renameGroup);
router.route("/addtogroup").put(protect, addToGroup);
router.route("/removefromgroup").put(protect, removeFromGroup);

module.exports = router;
