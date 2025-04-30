const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = Message;
