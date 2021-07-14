const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    coverPicture: {
      type: Object,
      default: "",
    },
    followers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    followings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    desc: {
      type: String,
      max: 200,
    },
    city: {
      type: String,
      max: 50,
    },
    town: {
      type: String,
      max: 50,
    },
    country: {
      type: String,
      max: 50,
    },
    relationship: {
      type: String,
      enum: [
        "single",
        "married",
        "divorced",
        "serious relationship",
        "engaged",
        "prefer not to say",
      ],
      defualt: "none",
    },
    birthday: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);
