const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  getNotifications,
  addNotification,
  removeNotification,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
router.route("/notification").get(protect, getNotifications);
router.route("/notification/add").post(protect, addNotification);
router.route("/notification/remove").post(protect, removeNotification);

module.exports = router;
